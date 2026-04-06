package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/database"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func CreateSupportRequest(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var supportRequest models.SupportRequest

		if err := c.ShouldBindJSON(&supportRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
			return
		}

		validate := validator.New()
		if err := validate.Struct(supportRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": err.Error()})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		supportRequest.CreatedAt = time.Now()

		var supportCollection *mongo.Collection = database.OpenCollection("support_anfrage", client)

		result, err := supportCollection.InsertOne(ctx, supportRequest)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create support request"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "Support request created successfully",
			"id":      result.InsertedID,
		})
	}
}
