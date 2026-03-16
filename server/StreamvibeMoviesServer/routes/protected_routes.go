package routes

import (
	controller "github.com/LindtAna/streamvibe/server/StreamvibeMoviesServer/controllers"
	"github.com/LindtAna/streamvibe/server/StreamvibeMoviesServer/middleware"
	"github.com/gin-gonic/gin"
)

func SetupProtectedRoutes(router *gin.Engine) {
	router.Use(middleware.AuthMiddleware())

	router.GET("/movie/:imdb_id", controller.GetMovie())
	router.POST("/addmovie", controller.AddMovie())
}
