package controllers

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/database"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// fügt einen Film oder eine Serie zur Merkliste des Benutzers hinzu
func AddToWatchList(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Benutzer-ID extrahieren (via Auth-Middleware
		userId, err := utils.GetUserIdFromContext(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found"})
			return
		}
		// URL-Parameter auslesen (/watchlist/movie/12345)
		mediaType := c.Param("type") // "movie" oder "serie"
		tmdbId := c.Param("tmdb_id")

		if tmdbId == "" || (mediaType != "movie" && mediaType != "serie") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Valid Movie/Serie ID and type required"})
			return
		}

		ctx, cancel := context.WithTimeout(c, 10*time.Second)
		defer cancel()

		userCollection := database.OpenCollection("users", client)

		// Einen eindeutigen String (Präfix + ID) für die Speicherung generieren,
		// da TMDB-IDs für Filme und Serien gleich sein können
		savedItem := fmt.Sprintf("%s_%s", mediaType, tmdbId)

		// Aktuelle Daten des Benutzers abrufen
		var user models.User
		err = userCollection.FindOne(ctx, bson.M{"user_id": userId}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// Prüfen, ob das Element bereits in der Watchlist existiert
		for _, item := range user.Watchlist {
			if item == savedItem {
				c.JSON(http.StatusOK, gin.H{
					"message": "Already in watchlist",
					"tmdb_id": tmdbId,
				})
				return
			}
		}

		// Zur Merkliste hinzufügen
		filter := bson.M{"user_id": userId}
		update := bson.M{
			"$addToSet": bson.M{"watchlist": savedItem},
		}

		result, err := userCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to watchlist"})
			return
		}

		if result.MatchedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Added to watchlist",
			"tmdb_id": tmdbId,
		})
	}

}

// entfernt einen Film oder eine Serie aus der Merkliste des Benutzers
func RemoveFromWatchlist(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, err := utils.GetUserIdFromContext(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found"})
			return
		}

		mediaType := c.Param("type")
		tmdbId := c.Param("tmdb_id")

		// Validierung
		if tmdbId == "" || (mediaType != "movie" && mediaType != "serie") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Valid Movie/Serie ID and type required"})
			return
		}

		ctx, cancel := context.WithTimeout(c, 10*time.Second)
		defer cancel()

		userCollection := database.OpenCollection("users", client)

		// String rekonstruieren, der in der DB gespeichert ist
		savedItem := fmt.Sprintf("%s_%s", mediaType, tmdbId)

		// Element aus dem Array entfernen
		filter := bson.M{"user_id": userId}
		update := bson.M{
			"$pull": bson.M{"watchlist": savedItem},
		}

		result, err := userCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove movie from watchlist"})
			return
		}

		if result.MatchedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Movie removed from watchlist",
			"tmdb_id": tmdbId,
		})
	}
}

// Merkliste abrufen mit TMDB-Daten
func GetWatchlist(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, err := utils.GetUserIdFromContext(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found"})
			return
		}

		ctx, cancel := context.WithTimeout(c, 10*time.Second)
		defer cancel()

		// Benutzerdokument aus der Datenbank holen
		userCollection := database.OpenCollection("users", client)
		var user models.User
		err = userCollection.FindOne(ctx, bson.M{"user_id": userId}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// Wenn die Merkliste leer ist, sofort leere Arrays zurückgeben
		if len(user.Watchlist) == 0 {
			c.JSON(http.StatusOK, gin.H{
				"movies": []interface{}{},
				"series": []interface{}{},
			})
			return
		}

		var movies []models.MovieCollectionItem
		var series []models.SerieCollectionItem

		// Jedes gespeicherte Element iterieren und Daten von TMDB abrufen
		for _, itemStr := range user.Watchlist {
			parts := strings.Split(itemStr, "_")

			// Überspringen, falls das Format nicht exakt aus 2 Teilen besteht
			// Schutz vor korrupten Daten
			if len(parts) != 2 {
				continue
			}

			mediaType := parts[0]
			tmdbId := parts[1]

			// Je nach Medientyp den entsprechenden TMDB-Endpunkt aufrufen
			switch mediaType {
			case "movie":
				movieData, err := utils.GetTMDBMovieDetails(tmdbId)
				if err == nil {
					movies = append(movies, models.MovieCollectionItem{
						ID:          movieData.ID,
						Title:       movieData.Title,
						PosterPath:  utils.GetPosterURL(movieData.PosterPath, "w500"),
						ReleaseDate: movieData.ReleaseDate,
						Rating:      movieData.VoteAverage,
					})
				}
			case "serie":
				serieData, err := utils.GetTMDBSerieDetails(tmdbId)
				if err == nil {
					series = append(series, models.SerieCollectionItem{
						ID:           serieData.ID,
						Title:        serieData.Name,
						PosterPath:   utils.GetPosterURL(serieData.PosterPath, "w500"),
						FirstAirDate: serieData.FirstAirDate,
						Rating:       serieData.VoteAverage,
					})
				}
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"movies": movies,
			"series": series,
		})
	}
}
