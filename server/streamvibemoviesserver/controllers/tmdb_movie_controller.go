package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/database"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var validateTMDB = validator.New()

// ruft Filmdetails von TMDB ab und kombiniert sie mit User-Reviews
func GetMovieTMDB(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c, 100*time.Second)
		defer cancel()

		movieID := c.Param("tmdb_id")

		if movieID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID is required"})
			return
		}

		// TMDB-Daten abrufen
		tmdbMovie, err := utils.GetTMDBMovieDetails(movieID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movie from TMDB", "details": err.Error()})
			return
		}

		// User-Reviews aus MongoDB abrufen
		var userReviewCollection *mongo.Collection = database.OpenCollection("user_reviews", client)

		filter := bson.M{"movie_id": movieID}
		cursor, err := userReviewCollection.Find(ctx, filter)

		var userReviews []models.UserReview
		if err == nil {
			defer cursor.Close(ctx)
			if err := cursor.All(ctx, &userReviews); err != nil {
				log.Printf("Warning: Failed to decode user reviews: %v", err)
				userReviews = []models.UserReview{}
			}
		} else {
			userReviews = []models.UserReview{}
		}

		// Konvertierung in Response-Format
		response := utils.ConvertToMovieDetailsResponse(tmdbMovie, userReviews)

		c.JSON(http.StatusOK, response)
	}
}

func UserReviewUpdateTMDB(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, err := utils.GetRoleFromContext(c)
		if err != nil || role != "USER" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User must be authorised"})
			return
		}

		userId, err := utils.GetUserIdFromContext(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User Id not found in context"})
			return
		}

		movieId := c.Param("tmdb_id")
		if movieId == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Movie Id required"})
			return
		}

		var req struct {
			Country string `json:"country" validateTMDB:"required"`
			Rating  int    `json:"rating" validateTMDB:"required,min=1,max=5"`
			Text    string `json:"text" validateTMDB:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var userCollection *mongo.Collection = database.OpenCollection("users", client)
		var user models.User
		err = userCollection.FindOne(ctx, bson.M{"user_id": userId}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		newReview := models.UserReview{
			ReviewID:  bson.NewObjectID(),
			UserID:    userId,
			UserName:  user.UserName,
			Country:   req.Country,
			Rating:    req.Rating,
			Text:      req.Text,
			CreatedAt: time.Now(),
		}

		// wird in der user_reviews Colllection mit movie_id geschpeichert
		var userReviewCollection *mongo.Collection = database.OpenCollection("user_reviews", client)

		reviewWithMovieID := bson.M{
			"review_id":  newReview.ReviewID,
			"user_id":    newReview.UserID,
			"user_name":  newReview.UserName,
			"country":    newReview.Country,
			"rating":     newReview.Rating,
			"text":       newReview.Text,
			"created_at": newReview.CreatedAt,
			"movie_id":   movieId,
		}

		_, err = userReviewCollection.InsertOne(ctx, reviewWithMovieID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving review"})
			return
		}

		c.JSON(http.StatusOK, newReview)
	}
}
