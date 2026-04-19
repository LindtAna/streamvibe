package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/database"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Film zur Merkliste hinzufügen
func AddToWatchList(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, err := utils.GetUserIdFromContext(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found"})
			return
		}

		tmdbId := c.Param("tmdb_id")
		if tmdbId == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID required"})
			return
		}

		ctx, cancel := context.WithTimeout(c, 100*time.Second)
		defer cancel()

		userCollection := database.OpenCollection("users", client)

		// Prüfen, ob bereits in Watchlist
		var user models.User
		err = userCollection.FindOne(ctx, bson.M{"user_id": userId}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// Prüfen auf Duplikate
		for _, item := range user.Watchlist {
			if item == tmdbId {
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
			"$addToSet": bson.M{"watchlist": tmdbId},
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

// Film/Serie aus Merkliste entfernen
func RemoveFromWatchlist(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, err := utils.GetUserIdFromContext(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found"})
			return
		}

		tmdbId := c.Param("tmdb_id")
		if tmdbId == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID required"})
			return
		}

		ctx, cancel := context.WithTimeout(c, 100*time.Second)
		defer cancel()

		userCollection := database.OpenCollection("users", client)
		filter := bson.M{"user_id": userId}
		update := bson.M{
			"$pull": bson.M{"watchlist": tmdbId},
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

		ctx, cancel := context.WithTimeout(c, 100*time.Second)
		defer cancel()

		// Benutzer abrufen
		userCollection := database.OpenCollection("users", client)
		var user models.User
		err = userCollection.FindOne(ctx, bson.M{"user_id": userId}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		if len(user.Watchlist) == 0 {
			c.JSON(http.StatusOK, gin.H{
				"movies": []interface{}{},
				"series": []interface{}{},
			})
			return
		}

		// Daten von TMDB für jede ID abrufen
		var movies []models.MovieCollectionItem
		var series []models.SerieCollectionItem

		for _, tmdbId := range user.Watchlist {
			// Zuerst versuchen als Film
			movieData, err := utils.GetTMDBMovieDetails(tmdbId)
			if err == nil {
				movies = append(movies, models.MovieCollectionItem{
					ID:          movieData.ID,
					Title:       movieData.Title,
					PosterPath:  utils.GetPosterURL(movieData.PosterPath, "w500"),
					ReleaseDate: movieData.ReleaseDate,
					Rating:      movieData.VoteAverage,
				})
				continue
			}

			// Wenn nicht Film, dann Serie
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

		c.JSON(http.StatusOK, gin.H{
			"movies": movies,
			"series": series,
		})
	}
}
