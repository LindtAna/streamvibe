package routes

import (
	controller "github.com/LindtAna/streamvibe/server/streamvibemoviesserver/controllers"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/middleware"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupProtectedRoutes(router *gin.Engine, client *mongo.Client) {

	protected := router.Group("/")

	protected.Use(middleware.AuthMiddleware())

	// protected.GET("/movie/:imdb_id", controller.GetMovie(client))
	// protected.POST("/addmovie", controller.AddMovie(client))
	protected.GET("/recommendedmovies", controller.GetRecommendedMovies(client))

	protected.PATCH("/updatereview/:imdb_id", controller.AdminReviewUpdate(client))
	// protected.POST("/addreview/:imdb_id", controller.UserReviewUpdate(client))
	protected.POST("/addreview/:tmdb_id", controller.UserReviewUpdateTMDB(client))

	// protected.POST("/watchlist/:imdb_id", controller.AddToWatchList(client))
	// protected.DELETE("/watchlist/:imdb_id", controller.RemoveFromWatchlist(client))
	protected.GET("/watchlist", controller.GetWatchlist(client))
}
