package routes

import (
	controller "github.com/LindtAna/streamvibe/server/streamvibemoviesserver/controllers"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/middleware"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupAdminRoutes(router *gin.Engine, client *mongo.Client) {

	admin := router.Group("/admin")

	// Middleware для проверки прав администратора
	admin.Use(
		middleware.AuthMiddleware(),
		middleware.AdminMiddleware(),
	)

	// Управление фильмами
	admin.POST("/addmovie", controller.AddMovie(client))

	// Управление support-запросами
	admin.GET("/support-requests", controller.GetAllSupportRequests(client))
	admin.POST("/support-response", controller.SendSupportResponse(client))
	admin.DELETE("/support-request/:id", controller.DeleteSupportRequest(client))
}
