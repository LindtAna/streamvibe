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
	// "go.mongodb.org/mongo-driver/v2/mongo/options"
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

		// wird in der user_reviews Collection mit movie_id geschpeichert
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

// ruft Sammlungen für die Homepage parallel ab
func GetHomeCollections(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var wg sync.WaitGroup
		var trending, topRated, nowPlaying []models.MovieCollectionItem

		// WaitGroup, 3 parallele Aufgaben
		wg.Add(3)

		// Trending
		go func() {
			defer wg.Done()
			if items, err := utils.FetchTMDBMovieList("/trending/movie/week?language=de-DE"); err == nil {
				trending = utils.ConvertToCollectionItems(items)
			}
		}()

		// Top Rated
		go func() {
			defer wg.Done()
			if items, err := utils.FetchTMDBMovieList("/movie/top_rated?language=de-DE&page=1"); err == nil {
				topRated = utils.ConvertToCollectionItems(items)
			}
		}()

		// Now Playing Im Kino
		go func() {
			defer wg.Done()
			if items, err := utils.FetchTMDBMovieList("/movie/now_playing?language=de-DE&page=1&region=DE"); err == nil {
				nowPlaying = utils.ConvertToCollectionItems(items)
			}
		}()

		// warten auf den Abschluss aller drei Anfragen
		wg.Wait()

		response := models.HomeCollectionsResponse{
			Trending:   trending,
			TopRated:   topRated,
			NowPlaying: nowPlaying,
		}

		c.JSON(http.StatusOK, response)
	}
}

// ruft Sammlungen nach Genres für die Movies-Seite ab
func GetMoviesPageCollections(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {

		// Definierte Genres für die Movies-Seite
		selectedGenres := []struct {
			ID   int //id from tmdb
			Name string
		}{
			{16, "Animation"},
			{28, "Action"},
			{99, "Dokumentarfilm"},
			{14, "Fantasy"},
			{36, "Historie"},
			{35, "Komödie"},
			{80, "Krimi"},
			{10749, "Liebesfilm"},
			{878, "Science Fiction"},
		}

		var wg sync.WaitGroup
		collections := make([]models.GenreCollection, len(selectedGenres))

		// Mutex für thread-safe Schreibvorgänge
		var mu sync.Mutex

		// Parallele Anfragen für jedes Genre
		for i, genre := range selectedGenres {
			wg.Add(1)
			go func(index int, genreID int, genreName string) {
				defer wg.Done()

				// Filme für dieses Genre abrufen (20 pro Genre)
				items, err := utils.FetchTMDBMoviesByGenre(genreID, 1)
				if err != nil {
					log.Printf("Error fetching genre %s: %v", genreName, err)
					return
				}

				// Maximal 20 Filme nehmen (tmdb standart response)
				maxMovies := 20
				if len(items) > maxMovies {
					items = items[:maxMovies]
				}

				movies := utils.ConvertToCollectionItems(items)

				mu.Lock()
				collections[index] = models.GenreCollection{
					GenreID:   genreID,
					GenreName: genreName,
					Movies:    movies,
				}
				mu.Unlock()
			}(i, genre.ID, genre.Name)
		}

		// Warten auf alle Anfragen
		wg.Wait()

		response := models.MoviesPageCollectionsResponse{
			Collections: collections,
		}

		c.JSON(http.StatusOK, response)
	}
}

// generiert Film-Empfehlungen basierend auf TMDB-Daten
// für jedes Lieblingsgenre des Benutzers werden 4 Filme abgerufen
// 2 mit den höchsten Bewertungen (top-rated)
// 2 die im aktuellen Monat am beliebtesten sind (popular)
func GetRecommendedMoviesTMDB(client *mongo.Client) gin.HandlerFunc {
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
		genreIDs := utils.MapGenreNamesToTMDBIDs(favourite_genres, true)

		if len(genreIDs) == 0 {
			c.JSON(http.StatusOK, []models.MovieCollectionItem{})
			return
		}

		// Empfehlungen von TMDB abrufen (4 Filme pro Genre)
		recommendations, err := utils.FetchMovieRecommendationsByGenres(genreIDs)
		if err != nil {
			log.Printf("Error fetching movie recommendations: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching recommendations"})
			return
		}

		// duplikate entfernen (falls ein Film in mehreren Genres vorkommt)
		uniqueRecommendations := utils.DeduplicateMovies(recommendations)

		c.JSON(http.StatusOK, uniqueRecommendations)
	}
}
