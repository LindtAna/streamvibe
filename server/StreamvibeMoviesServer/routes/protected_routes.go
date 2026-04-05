package routes

import (
	controller "github.com/LindtAna/streamvibe/server/StreamvibeMoviesServer/controllers"
	"github.com/LindtAna/streamvibe/server/StreamvibeMoviesServer/middleware"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupProtectedRoutes(router *gin.Engine, client *mongo.Client) {
	router.Use(middleware.AuthMiddleware())

	router.GET("/movie/:imdb_id", controller.GetMovie(client))
	router.POST("/addmovie", controller.AddMovie(client))
	router.GET("/recommendedmovies", controller.GetRecommendedMovies(client))

	router.PATCH("/updatereview/:imdb_id", controller.AdminReviewUpdate(client))
	router.POST("/addreview/:imdb_id", controller.UserReviewUpdate(client))

	router.POST("/watchlist/:imdb_id", controller.AddToWatchList(client))
	router.DELETE("/watchlist/:imdb_id", controller.RemoveFromWatchlist(client))
	router.GET("/watchlist", controller.GetWatchlist(client))
}
