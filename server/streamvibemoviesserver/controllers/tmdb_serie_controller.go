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

// ruft Sammlungen nach Genres für die Series-Seite ab
func GetSeriesPageCollections(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {

		// Definierte Genres für die Series-Seite
		selectedGenres := []struct {
			ID   int //id from tmdb
			Name string
		}{
			{10759, "Action"},
			{16, "Animation"},
			{35, "Komödie"},
			{80, "Krimi"},
			{99, "Doku"},
			{18, "Drama"},
			{10765, "Sci-Fi & Fantasy"},
			{10768, "War & Politics"},
		}

		var wg sync.WaitGroup
		collections := make([]models.GenreCollectionSeries, len(selectedGenres))

		// Mutex für thread-safe Schreibvorgänge
		var mu sync.Mutex

		// Parallele Anfragen für jedes Genre
		for i, genre := range selectedGenres {
			wg.Add(1)
			go func(index int, genreID int, genreName string) {
				defer wg.Done()

				items, err := utils.FetchTMDBSeriesByGenre(genreID, 1)
				if err != nil {
					log.Printf("Error fetching genre %s: %v", genreName, err)
					return
				}

				// Maximal 20 Serien nehmen (tmdb standart response)
				maxSeries := 20
				if len(items) > maxSeries {
					items = items[:maxSeries]
				}

				series := utils.ConvertToCollectionSerieItems(items)

				mu.Lock()
				collections[index] = models.GenreCollectionSeries{
					GenreID:   genreID,
					GenreName: genreName,
					Series:    series,
				}
				mu.Unlock()
			}(i, genre.ID, genre.Name)
		}

		// Warten auf alle Anfragen
		wg.Wait()

		response := models.SeriesPageCollectionsResponse{
			Collections: collections,
		}

		c.JSON(http.StatusOK, response)
	}
}

func UserReviewSerieUpdateTMDB(client *mongo.Client) gin.HandlerFunc {
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

		serieId := c.Param("tmdb_id")
		if serieId == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Serie Id required"})
			return
		}

		var req struct {
			Country string `json:"country" validate:"required"`
			Rating  int    `json:"rating" validate:"required,min=1,max=5"`
			Text    string `json:"text" validate:"required"`
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

		// wird in der user_reviews Collection mit serie_id geschpeichert
		var userReviewCollection *mongo.Collection = database.OpenCollection("user_reviews", client)

		reviewWithSerieID := bson.M{
			"review_id":  newReview.ReviewID,
			"user_id":    newReview.UserID,
			"user_name":  newReview.UserName,
			"country":    newReview.Country,
			"rating":     newReview.Rating,
			"text":       newReview.Text,
			"created_at": newReview.CreatedAt,
			"serie_id":   serieId,
		}

		_, err = userReviewCollection.InsertOne(ctx, reviewWithSerieID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving review"})
			return
		}

		c.JSON(http.StatusOK, newReview)
	}
}

// generiert Serien-Empfehlungen basierend auf TMDB-Daten
// für jedes Lieblingsgenre des Benutzers werden 4 Serien abgerufen
// 2 mit den höchsten Bewertungen (top-rated)
// 2 die im aktuellen Jahr am beliebtesten sind (popular)
func GetRecommendedSeriesTMDB(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, err := utils.GetUserIdFromContext(c)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User Id not found in context"})
			return
		}

		favourite_genres, err := GetUsersFavouriteGenres(userId, c, client)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Genre-Namen zu TMDB-IDs konvertieren
		genreIDs := utils.MapGenreNamesToTMDBIDs(favourite_genres, false) // false = series

		if len(genreIDs) == 0 {
			c.JSON(http.StatusOK, []models.SerieCollectionItem{})
			return
		}

		// Empfehlungen von TMDB abrufen (4 Serien pro Genre)
		recommendations, err := utils.FetchSerieRecommendationsByGenres(genreIDs)
		if err != nil {
			log.Printf("Error fetching series recommendations: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching recommendations"})
			return
		}

		// Duplikate entfernen (falls eine Serie in mehreren Genres vorkommt)
		uniqueRecommendations := utils.DeduplicateSeries(recommendations)

		c.JSON(http.StatusOK, uniqueRecommendations)
	}
}
