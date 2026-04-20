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

	protected.PATCH("/updatereview/:imdb_id", controller.AdminReviewUpdate(client))
	protected.POST("/addreview/:tmdb_id", controller.UserReviewUpdateTMDB(client))

	protected.POST("/watchlist/:tmdb_id", controller.AddToWatchList(client))
	protected.DELETE("/watchlist/:tmdb_id", controller.RemoveFromWatchlist(client))
	protected.GET("/watchlist", controller.GetWatchlist(client))

	protected.GET("/recommendedmovies", controller.GetRecommendedMoviesTMDB(client))
	protected.GET("/recommendedseries", controller.GetRecommendedSeriesTMDB(client))
}
