package legacycontrollers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/database"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"golang.org/x/crypto/bcrypt"
)

// Text-Passwort mithilfe des bcrypt-Algorithmus verschlüsselt
func HashPasswordBcrypt(password string) (string, error) {
	HashPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(HashPassword), nil
}

// erstellt einen neuen Benutzer in der Datenbank
func RegisterUserBcrypt(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user models.User

		// Überprüft, ob die eingehenden JSON-Daten dem user_model entsprechen
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
			return
		}

		// Validiert die Struktur der Benutzerdaten
		validate := validator.New()
		if err := validate.Struct(user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": err.Error()})
			return

		}

		// Verschlüsselt das Passwort vor dem Speichern in der Datenbank
		hashedPassword, err := HashPasswordBcrypt(user.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to hash password"})
			return
		}

		// Setzt ein Timeout für die Datenbankabfrage
		var ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var userCollection *mongo.Collection = database.OpenCollection("users", client)

		// Prüft, ob bereits ein Benutzer mit dieser E-Mail-Adresse existiert
		count, err := userCollection.CountDocuments(ctx, bson.D{{Key: "email", Value: user.Email}})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing user"})
			return
		}
		if count > 0 {
			c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
			return
		}

		// Generiert eine neue ObjectID + Erstellungszeitstempel
		user.UserID = bson.NewObjectID().Hex()
		user.CreatedAt = time.Now()
		user.UpdatedAt = time.Now()
		user.Password = hashedPassword

		// Benutzer in die Datenbank eingwfügt
		result, err := userCollection.InsertOne(ctx, user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}

		c.JSON(http.StatusCreated, result)

	}
}

// authentifiziert den Benutzer und setzt JWT-Cookies
func LoginUserBcrypt(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var userLogin models.UserLogin
		//liest die Anmeldedaten aus dem Request-Body
		if err := c.ShouldBindJSON(&userLogin); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
			return
		}
		var ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var foundUser models.User
		var userCollection *mongo.Collection = database.OpenCollection("users", client)

		//sucht user anhand der e-mail-Adresse in der DB
		err := userCollection.FindOne(ctx, bson.D{{Key: "email", Value: userLogin.Email}}).Decode(&foundUser)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		// Vergleicht das eingegebene Passwort mit dem gespeicherten Hash
		err = bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(userLogin.Password))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		//Generiert neue access & refresh tokens
		token, refreshToken, err := utils.GenerateAllTokens(foundUser.Email, foundUser.UserName, foundUser.Role, foundUser.UserID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
			return
		}

		//aktualisiert die Tokens in der DB
		err = utils.UpdateAllTokens(foundUser.UserID, token, refreshToken, client)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tokens"})
			return
		}

		// konfiguriert die Cookie-Sicherheitseinstellungen basierend auf der Umgebung (Produktion/Entwicklung)
		isProd := os.Getenv("ENV") == "production"

		sameSiteMode := http.SameSiteLaxMode
		if isProd {
			sameSiteMode = http.SameSiteNoneMode
		}

		// Setzt das Access-Token als HttpOnly-Cookie
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "access_token",
			Value:    token,
			Path:     "/",
			MaxAge:   86400,
			Secure:   isProd,
			HttpOnly: true,
			SameSite: sameSiteMode,
		})

		// Setzt das Refresh-Token als HttpOnly-Cookie
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "refresh_token",
			Value:    refreshToken,
			Path:     "/",
			MaxAge:   86400,
			Secure:   isProd,
			HttpOnly: true,
			SameSite: sameSiteMode,
		})

		//sendet die Benutzerdaten (ohne sensible Informationen) an den Client zurück
		c.JSON(http.StatusOK, models.UserResponse{
			UserId:          foundUser.UserID,
			UserName:        foundUser.UserName,
			Email:           foundUser.Email,
			Role:            foundUser.Role,
			FavouriteGenres: foundUser.FavouriteGenres,
			Watchlist:       foundUser.Watchlist,
		})

	}
}

// meldet den Benutzer ab, indem die Token-Cookies und DB-inträge gelöscht werden
func LogoutHandlerBcrypt(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var UserLogout struct {
			UserId string `json:"user_id"`
		}
		// Liest die Benutzer-ID aus dem Request
		err := c.ShouldBindJSON(&UserLogout)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		fmt.Println("User ID from Logout request:", UserLogout.UserId)

		// Löscht die Tokens in der DB
		err = utils.UpdateAllTokens(UserLogout.UserId, "", "", client) // Clear tokens in the database
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error logging out"})
			return
		}

		isProd := os.Getenv("ENV") == "production"

		sameSiteMode := http.SameSiteLaxMode
		if isProd {
			sameSiteMode = http.SameSiteNoneMode
		}

		//entfernt das Access-Token-Cookie: MaxAge wird auf -1 gesetzt
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "access_token",
			Value:    "",
			Path:     "/",
			MaxAge:   -1,
			Secure:   isProd,
			HttpOnly: true,
			SameSite: sameSiteMode,
		})

		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "refresh_token",
			Value:    "",
			Path:     "/",
			MaxAge:   -1,
			Secure:   isProd,
			HttpOnly: true,
			SameSite: sameSiteMode,
		})

		c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
	}
}

// erstellt neue Tokens, wenn das Access-Token abgelaufen ist
func RefreshTokenHandlerBcrypt(client *mongo.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(c, 10*time.Second)
		defer cancel()

		refreshToken, err := c.Cookie("refresh_token")

		if err != nil {
			fmt.Println("error", err.Error())
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unable to retrieve refresh token from cookie"})
			return
		}

		// Überprüft die Gültigkeit des Refresh-Tokens
		claim, err := utils.ValidateRefreshToken(refreshToken)
		if err != nil || claim == nil {
			fmt.Println("error", err.Error())
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired refresh token"})
			return
		}

		var userCollection *mongo.Collection = database.OpenCollection("users", client)
		var user models.User

		// Findet den Benutzer anhand der ID aus den Token-Claims
		err = userCollection.FindOne(ctx, bson.D{{Key: "user_id", Value: claim.UserId}}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}

		// Generiert ein neues Token-Paar
		newToken, newRefreshToken, _ := utils.GenerateAllTokens(user.Email, user.UserName, user.Role, user.UserID)
		err = utils.UpdateAllTokens(user.UserID, newToken, newRefreshToken, client)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating tokens"})
			return
		}

		isProd := os.Getenv("ENV") == "production"

		sameSiteMode := http.SameSiteLaxMode
		if isProd {
			sameSiteMode = http.SameSiteNoneMode
		}
		// Setzt die neuen Cookies im Browser des Clients
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "access_token",
			Value:    newToken,
			Path:     "/",
			MaxAge:   86400,
			Secure:   isProd,
			HttpOnly: true,
			SameSite: sameSiteMode,
		})

		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "refresh_token",
			Value:    newRefreshToken,
			Path:     "/",
			MaxAge:   604800,
			Secure:   isProd,
			HttpOnly: true,
			SameSite: sameSiteMode,
		})

		c.JSON(http.StatusOK, gin.H{"message": "Tokens refreshed"})
	}
}
