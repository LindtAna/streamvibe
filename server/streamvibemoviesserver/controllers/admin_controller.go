package controllers

import (
	"context"
	"fmt"
	"html"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/database"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"gopkg.in/gomail.v2"
)

// AddMovie fügt einen neuen Film zur Datenbank hinzu
func AddMovie(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		var movie models.Movie
		// Bindet den JSON-Body an die Movie-Struktur
		if err := c.ShouldBindJSON(&movie); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		// Validiert die Struktur (überprüft Pflichtfelder)
		if err := validate.Struct(movie); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": err.Error()})
			return
		}

		var movieCollection *mongo.Collection = database.OpenCollection("movies", client)

		// Fügt das Filmdokument in die MongoDB ein
		result, err := movieCollection.InsertOne(ctx, movie)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to add movie",
				"details": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message":     "Movie added successfully",
			"inserted_id": result.InsertedID,
			"db_id":       movie.DbID,
		})
	}
}

// ruft alle Support-Anfragen aus der Datenbank ab
func GetAllSupportRequests(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		supportCollection := database.OpenCollection("support_anfrage", client)
		var supportRequests []models.SupportRequest

		// Sortier-Optionen
		opts := options.Find()

		email, exists := c.Get("email")
		isDemoAdmin := exists && email == "admin-demo@streamvibe.app"

		if isDemoAdmin {
			// Demo-Modus: Sortierung nach Erstellungsdatum in aufsteigender Reihenfolge (ältestes zuerst) + Limit 3
			opts.SetSort(bson.D{{Key: "created_at", Value: 1}})
			opts.SetLimit(3)
		} else {
			// Regulärer Administrator: Neueste Anfragen zuerst
			opts.SetSort(bson.D{{Key: "created_at", Value: -1}})
		}

		// Führt die Abfrage in der Datenbank aus
		cursor, err := supportCollection.Find(ctx, bson.M{}, opts)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to fetch support requests",
			})
			return
		}
		defer cursor.Close(ctx)

		// Dekodiert alle gefundenen Dokumente in den Slice supportRequests
		if err = cursor.All(ctx, &supportRequests); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to decode support requests",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"count":   len(supportRequests),
			"data":    supportRequests,
		})
	}
}

// verschickt eine Antwort per E-Mail und speichert sie in der DB
func SendSupportResponse(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {

		// Struktur für die eingehende Anfrage (ID der Anfrage und der Antworttext)
		var requestBody struct {
			SupportRequestID string `json:"support_request_id" binding:"required"`
			ResponseText     string `json:"response_text" binding:"required,min=10,max=2000"`
		}

		if err := c.ShouldBindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid input data",
				"details": err.Error(),
			})
			return
		}

		ctx, cancel := context.WithTimeout(c.Request.Context(), 15*time.Second)
		defer cancel()

		// parsing ObjectID
		objectID, err := bson.ObjectIDFromHex(requestBody.SupportRequestID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid support request ID format",
			})
			return
		}

		// Support-Anfrage in der Datenbank gesucht
		supportCollection := database.OpenCollection("support_anfrage", client)
		var supportRequest models.SupportRequest

		err = supportCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&supportRequest)
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Support request not found",
			})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Database error",
			})
			return
		}

		//Antwort an den Nutzer versendet
		if err := sendEmail(
			supportRequest.Email,
			supportRequest.FirstName,
			supportRequest.LastName,
			requestBody.ResponseText,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to send email",
				"details": err.Error(),
			})
			return
		}

		//AdminID aus dem Kontext abrufen (in der Middleware festgelegt)
		adminIDValue, exists := c.Get("admin_id")
		var adminID bson.ObjectID
		if exists {
			if oid, ok := adminIDValue.(bson.ObjectID); ok {
				adminID = oid
			}
		}

		//Speicherung der Antwort in der DB
		responsesCollection := database.OpenCollection("support_responses", client)
		supportResponse := models.SupportResponse{
			SupportRequestID: objectID,
			AdminID:          adminID,
			Response:         requestBody.ResponseText,
			SentAt:           time.Now(),
		}

		_, err = responsesCollection.InsertOne(ctx, supportResponse)
		if err != nil {
			fmt.Printf("Warning: Failed to save support response to DB: %v\n", err)
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Response sent successfully",
		})
	}
}

// konfiguriert den SMTP-Server und verschickt eine HTML-E-Mail
func sendEmail(recipientEmail, firstName, lastName, responseText string) error {
	// SMTP-Einstellungen aus den Umgebungsvariablen geladen
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPortStr := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPassword := os.Getenv("SMTP_PASSWORD")

	if smtpHost == "" || smtpUser == "" || smtpPassword == "" {
		return fmt.Errorf("SMTP configuration missing in .env file")
	}

	smtpPort, _ := strconv.Atoi(smtpPortStr)
	if smtpPort == 0 {
		smtpPort = 587
	}

	// E-Mail-Nachricht erstellt
	m := gomail.NewMessage()
	m.SetHeader("From", "StreamVibe Support <noreply@streamvibe-go.vercel.app>")
	m.SetHeader("To", recipientEmail)
	m.SetHeader("Subject", "Antwort auf Ihre Support-Anfrage - StreamVibe")

	// HTML-Inhalt der E-Mail erstellt
	// + Escaping gegen XSS-Angriffe
	body := fmt.Sprintf(`<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
	<h2 style="color: #E50000;">StreamVibe Support</h2>
	<p>Hallo %s %s,</p>
	<div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
		<p style="white-space: pre-wrap;">%s</p>
	</div>
	<p>Mit freundlichen Grüßen,<br>Ihr StreamVibe Team</p>
</body>
</html>`,
		html.EscapeString(firstName),
		html.EscapeString(lastName),
		html.EscapeString(responseText),
	)

	m.SetBody("text/html", body)

	//initialisiert den Dialer und sendet die E-Mail ab
	d := gomail.NewDialer(smtpHost, smtpPort, smtpUser, smtpPassword)

	return d.DialAndSend(m)
}

// entfernt eine Support-Anfrage aus der DB
func DeleteSupportRequest(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {

		email, exists := c.Get("email")
		isDemoAdmin := exists && email == "admin-demo@streamvibe.app"

		if isDemoAdmin {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Demo-Modus: Löschen von Support-Anfragen ist nicht erlaubt",
			})
			return
		}

		// ID aus der URL-Parameter (/support/:id)
		requestID := c.Param("id")

		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		objectID, err := bson.ObjectIDFromHex(requestID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request ID format",
			})
			return
		}

		supportCollection := database.OpenCollection("support_anfrage", client)

		// Support-Anfrage mit der passenden ID gelöscht
		result, err := supportCollection.DeleteOne(ctx, bson.M{"_id": objectID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to delete support request",
			})
			return
		}

		if result.DeletedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Support request not found",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Support request deleted successfully",
		})
	}
}
