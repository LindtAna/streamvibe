package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/LindtAna/streamvibe/server/StreamvibeMoviesServer/database"
	"github.com/LindtAna/streamvibe/server/StreamvibeMoviesServer/models"
	"github.com/LindtAna/streamvibe/server/StreamvibeMoviesServer/utils"
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

		imdbId := c.Param("imdb_id")
		if imdbId == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID required"})
			return
		}

		ctx, cancel := context.WithTimeout(c, 100*time.Second)
		defer cancel()

		// Prüfen, ob der Film existiert
		movieCollection := database.OpenCollection("movies", client)
		var movie models.Movie
		err = movieCollection.FindOne(ctx, bson.M{"imdb_id": imdbId}).Decode(&movie)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
			return
		}

		// Film zur Merkliste hinzufügen
		userCollection := database.OpenCollection("users", client)
		filter := bson.M{"user_id": userId}
		update := bson.M{
			"$addToSet": bson.M{"watchlist": imdbId},
		}

		result, err := userCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add movie to watchlist"})
			return
		}

		if result.MatchedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Movie added to watchlist",
			"imdb_id": imdbId,
		})
	}
}

// Film aus Merkliste entfernen
func RemoveFromWatchlist(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, err := utils.GetUserIdFromContext(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found"})
			return
		}

		imdbId := c.Param("imdb_id")
		if imdbId == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID required"})
			return
		}

		ctx, cancel := context.WithTimeout(c, 100*time.Second)
		defer cancel()

		userCollection := database.OpenCollection("users", client)
		filter := bson.M{"user_id": userId}
		update := bson.M{
			"$pull": bson.M{"watchlist": imdbId},
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
			"imdb_id": imdbId,
		})
	}
}

// Merkliste abrufen
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
			c.JSON(http.StatusOK, []models.Movie{})
			return
		}

		// Filme aus Merkliste abrufen
		movieCollection := database.OpenCollection("movies", client)
		filter := bson.M{"imdb_id": bson.M{"$in": user.Watchlist}}

		cursor, err := movieCollection.Find(ctx, filter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movies"})
			return
		}
		defer cursor.Close(ctx)

		var movies []models.Movie
		if err := cursor.All(ctx, &movies); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode movies"})
			return
		}

		if movies == nil {
			movies = []models.Movie{}
		}

		c.JSON(http.StatusOK, movies)
	}
}
