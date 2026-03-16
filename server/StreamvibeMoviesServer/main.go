package main

import (
	"fmt"

	"github.com/gin-gonic/gin"

	"github.com/LindtAna/streamvibe/server/StreamvibeMoviesServer/routes"
)

func main() {
	router := gin.Default()

	router.GET("/hi", func(c *gin.Context) {
		c.String(200, "hi, streamvibe")
	})

	routes.SetupUnprotectedRoutes(router)
	routes.SetupProtectedRoutes(router)

	if err := router.Run(":8080"); err != nil {
		fmt.Println("Failed to start server", err)
	}
}
