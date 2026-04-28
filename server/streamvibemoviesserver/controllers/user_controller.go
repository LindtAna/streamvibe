// //////// Password hashing uses Argon2 (replacing legacy bcrypt implementation) ////////////
package controllers

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/database"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"golang.org/x/crypto/argon2"
)

// Argon2id-Parameter (OWASP-Empfehlungen)
const (
	argon2Time    = 3         // Anzahl der Iterationen
	argon2Memory  = 64 * 1024 // Speicher in KiB (64 MB)
	argon2Threads = 4         // Anzahl paralleler Threads
	argon2KeyLen  = 32        // Länge des erzeugten Keys (32 Bytes)
	saltLength    = 16        // Länge des Salts (16 Bytes)
)

// verschlüsselt ein Text-Passwort mithilfe des Argon2id-Algorithmus
func HashPassword(password string) (string, error) {
	// Zufälliges Salt generieren
	salt := make([]byte, saltLength)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	// Argon2id-Hash generieren
	hash := argon2.IDKey([]byte(password), salt, argon2Time, argon2Memory, argon2Threads, argon2KeyLen)

	// Salt und Hash im Format: $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash> kodieren
	// Base64-Kodierung für Salt und Hash
	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	// Format: $argon2id$v=19$m=memory,t=time,p=threads$salt$hash
	encodedHash := fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version, argon2Memory, argon2Time, argon2Threads, b64Salt, b64Hash)

	return encodedHash, nil
}

// vergleicht ein Klartext-Passwort mit einem gespeicherten Argon2id-Hash
func ComparePasswordAndHash(password, encodedHash string) (bool, error) {
	// Kodierte Hash-Teile extrahieren
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		return false, fmt.Errorf("invalid hash format")
	}

	// Parameter extrahieren
	var version int
	var memory, time, threads uint32
	_, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &memory, &time, &threads)
	if err != nil {
		return false, err
	}
	_, err = fmt.Sscanf(parts[2], "v=%d", &version)
	if err != nil {
		return false, err
	}

	// Salt und Hash dekodieren
	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return false, err
	}
	decodedHash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return false, err
	}

	// Hash des eingegebenen Passworts mit denselben Parametern berechnen
	passwordHash := argon2.IDKey([]byte(password), salt, time, memory, uint8(threads), uint32(len(decodedHash)))

	// Constant-time-Vergleich (Schutz vor Timing-Attacken)
	return subtle.ConstantTimeCompare(passwordHash, decodedHash) == 1, nil
}

// erstellt einen neuen Benutzer in der Datenbank
func RegisterUser(client *mongo.Client) gin.HandlerFunc {
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
		hashedPassword, err := HashPassword(user.Password)
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

		// Benutzer in die Datenbank einfügen
		result, err := userCollection.InsertOne(ctx, user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}

		c.JSON(http.StatusCreated, result)

	}
}

// authentifiziert den Benutzer und setzt JWT-Cookies
func LoginUser(client *mongo.Client) gin.HandlerFunc {
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

		// Vergleicht das eingegebene Passwort mit dem gespeicherten Argon2id-Hash
		match, err := ComparePasswordAndHash(userLogin.Password, foundUser.Password)
		if err != nil || !match {
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

// LogoutHandler meldet den Benutzer ab, indem die Token-Cookies und DB-Einträge gelöscht werden
func LogoutHandler(client *mongo.Client) gin.HandlerFunc {
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

// RefreshTokenHandler erstellt neue Tokens, wenn das Access-Token abgelaufen ist
func RefreshTokenHandler(client *mongo.Client) gin.HandlerFunc {
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

// GetUsersFavouriteGenres ruft die bevorzugten Filmgenres eines Benutzers ab
func GetUsersFavouriteGenres(userId string, c *gin.Context, client *mongo.Client) ([]string, error) {

	var ctx, cancel = context.WithTimeout(c, 10*time.Second)
	defer cancel()

	// Filtert nach der Benutzer-ID
	filter := bson.D{{Key: "user_id", Value: userId}} //bson.D is a slice(dynamic wrapper over an array) that stores fields strictly in the specified order

	// Projection schränkt die zurückgegebenen Felder ein, um Bandbreite zu sparen
	projection := bson.M{
		"favourite_genres.genre_name": 1,
		"_id":                         0,
	}

	opts := options.FindOne().SetProjection(projection)
	var result bson.M

	var userCollection *mongo.Collection = database.OpenCollection("users", client)
	err := userCollection.FindOne(ctx, filter, opts).Decode(&result)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return []string{}, nil
		}
		return nil, err
	}

	// Extrahiert das Array mit den Lieblingsgenres
	favGenresArray, ok := result["favourite_genres"].(bson.A) //bson.A = slice([]interface{}), which stores array elements from MongoDB
	if !ok {
		return []string{}, nil
	}
	var genreNames []string

	// Iteriert durch die BSON-Struktur, um die reinen Genrenamen als Strings zu erhalten
	for _, item := range favGenresArray {
		if genreMap, ok := item.(bson.D); ok {
			for _, elem := range genreMap {
				if elem.Key == "genre_name" {
					if name, ok := elem.Value.(string); ok {
						genreNames = append(genreNames, name)
					}
				}
			}
		}
	}

	return genreNames, nil
}
