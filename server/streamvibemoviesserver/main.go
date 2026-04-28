package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/database"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func main() {
	// Initialisiert den Gin-Router mit Standard-Middleware (Logger und Recovery)
	router := gin.Default()

	// Test-Endpunkt zur Überprüfung, ob der Server läuft
	router.GET("/hi", func(c *gin.Context) {
		c.String(200, "hi, streamvibe")
	})

	// Umgebungsvariablen aus der .env-Datei
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Warning: unable to find .env file")
	}

	// Prüft, ob sich die Anwendung im Produktionsmodus befindet
	isProd := os.Getenv("ENV") == "production"

	// Konfiguriert die zulässigen Ursprünge (Origins) für CORS
	var origins []string
	if isProd {
		allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
		if allowedOrigins != "" {
			origins = strings.Split(allowedOrigins, ",")
			for i := range origins {
				origins[i] = strings.TrimSpace(origins[i])
				log.Println("Allowed Origin:", origins[i])
			}
		}
	} else { // Standard-Ursprung für die lokale Entwicklung
		origins = []string{"http://localhost:5173"}
		log.Println("Allowed Origin: http://localhost:5173")
	}

	// Wendet die CORS-Middleware (Cross-Origin Resource Sharing) auf den Router an
	router.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Stellt die Verbindung zur MongoDB-Datenbank her
	var client *mongo.Client = database.DBConnect()
	// Überprüft die Verbindung zur Datenbank mit einem Ping
	if err := client.Ping(context.Background(), nil); err != nil {
		log.Fatalf("Failed to reach server: %v", err)
	}

	// Stellt sicher, dass die Datenbankverbindung beim Beenden der Anwendung sauber geschlossen wird
	defer func() {
		err := client.Disconnect(context.Background())
		if err != nil {
			log.Fatalf("Failed to disconnect from MongoDB: %v", err)
		}
	}()

	// Registriert die öffentlichen und geschützten API-Routen
	routes.SetupUnprotectedRoutes(router, client)
	routes.SetupProtectedRoutes(router, client)
	routes.SetupAdminRoutes(router, client)

	// Startet den HTTP-Server auf Port 8080
	if err := router.Run(":8080"); err != nil {
		fmt.Println("Failed to start server", err)
	}
}
