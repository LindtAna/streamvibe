package controllers

import (
	"context"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/database"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var validateTMDBSerie = validator.New()

// ruft Filmdetails von TMDB ab und kombiniert sie mit User-Reviews
func GetSerieTMDB(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c, 100*time.Second)
		defer cancel()

		serieID := c.Param("tmdb_id")

		if serieID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Serie ID is required"})
			return
		}

		// TMDB-Daten abrufen
		tmdbSerie, err := utils.GetTMDBSerieDetails(serieID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch serie from TMDB", "details": err.Error()})
			return
		}

		// User-Reviews aus MongoDB abrufen
		var userReviewCollection *mongo.Collection = database.OpenCollection("user_reviews", client)

		filter := bson.M{"serie_id": serieID}
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
		response := utils.ConvertToSerieDetailsResponse(tmdbSerie, userReviews)

		c.JSON(http.StatusOK, response)
	}
}

// ruft Sammlungen für die Homepage parallel ab (Beliebt и Bestbewertet)
func GetHomeCollectionsSeries(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var wg sync.WaitGroup
		var trending, topRated []models.SerieCollectionItem

		// WaitGroup, 2 parallele Aufgaben
		wg.Add(2)

		// Beliebt
		go func() {
			defer wg.Done()

			if items, err := utils.FetchTMDBSerieList("/trending/tv/week?language=de-DE"); err == nil {
				trending = utils.ConvertToCollectionSerieItems(items)
			} else {
				log.Printf("Error fetching trending series: %v", err)
			}
		}()

		// Bestbewertet
		go func() {
			defer wg.Done()
			if items, err := utils.FetchTMDBSerieList("/tv/top_rated?language=de-DE&page=1"); err == nil {
				topRated = utils.ConvertToCollectionSerieItems(items)
			} else {
				log.Printf("Error fetching top rated series: %v", err)
			}
		}()

		// warten auf den Abschluss aller Anfragen
		wg.Wait()

		response := models.HomeCollectionsSerieResponse{
			Trending: trending,
			TopRated: topRated,
		}

		c.JSON(http.StatusOK, response)
	}
}
