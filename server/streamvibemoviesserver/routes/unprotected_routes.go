package routes

import (
	controller "github.com/LindtAna/streamvibe/server/streamvibemoviesserver/controllers"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupUnprotectedRoutes(router *gin.Engine, client *mongo.Client) {
	router.GET("/movies", controller.GetMovies(client))
	router.GET("/genres", controller.GetGenres(client))
	router.POST("/register", controller.RegisterUser(client))
	router.POST("/login", controller.LoginUser(client))
	router.POST("/logout", controller.LogoutHandler(client))
	router.POST("/refresh", controller.RefreshTokenHandler(client))
	router.POST("/support", controller.CreateSupportRequest(client))
	router.GET("/movie/:tmdb_id", controller.GetMovieTMDB(client))
	router.GET("/home-collections", controller.GetHomeCollections(client))
	router.GET("/movies-page-collections", controller.GetMoviesPageCollections(client))
	router.GET("/home-collections-series", controller.GetHomeCollectionsSeries(client))
	router.GET("/series-page-collections", controller.GetSeriesPageCollections(client))

}
