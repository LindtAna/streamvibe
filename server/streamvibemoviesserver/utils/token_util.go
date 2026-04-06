package utils

import (
	"context"
	"errors"
	"os"

	// "strings"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/database"
	"github.com/gin-gonic/gin"
	jwt "github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type SignedDetails struct {
	UserId   string
	UserName string
	Email    string
	Role     string
	jwt.RegisteredClaims
}

var SECRET_KEY_TOKEN string = os.Getenv("SECRET_KEY")
var SECRET_KEY_REFRESH_TOKEN string = os.Getenv("SECRET_KEY_REFRESH_TOKEN")

func GenerateAllTokens(email, userName, role, userId string) (string, string, error) {
	claims := &SignedDetails{
		Email:    email,
		UserName: userName,
		Role:     role,
		UserId:   userId,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "streamvibe",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(SECRET_KEY_TOKEN))

	if err != nil {
		return "", "", err
	}

	refreshClaims := &SignedDetails{
		Email:    email,
		UserName: userName,
		Role:     role,
		UserId:   userId,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "streamvibe",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * 7 * time.Hour)),
		},
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	signedRefreshToken, err := refreshToken.SignedString([]byte(SECRET_KEY_REFRESH_TOKEN))

	if err != nil {
		return "", "", err
	}

	return signedToken, signedRefreshToken, nil
}

func UpdateAllTokens(userId, token, refreshToken string, client *mongo.Client) (err error) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	updateAt, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	//_ ->blank identifier, ignore value (here - error)  || t, err := time.Parse(layout, value)
	//RFC3339 ist ein Standard für Datums- und Zeitformate. 2006-01-02T15:04:05Z07:00

	updateData := bson.M{
		"$set": bson.M{
			"token":         token,
			"refresh_token": refreshToken,
			"update_at":     updateAt,
		},
	}

	var userCollection *mongo.Collection = database.OpenCollection("users", client)

	_, err = userCollection.UpdateOne(ctx, bson.M{"user_id": userId}, updateData)

	if err != nil {
		return err
	}
	return nil
}

func GetAccessToken(c *gin.Context) (string, error) {
	// authHeader := c.Request.Header.Get("Authorization") //Authorization: Bearer <token>

	// if authHeader == "" {
	// 	return "", errors.New("Authorization header is required")
	// }
	// // tokenString := authHeader[len("Bearer"):]
	// tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	// if !strings.HasPrefix(authHeader, "Bearer ") {
	// 	return "", errors.New("Invalid authorization header format")
	// }

	// if tokenString == "" {
	// 	return "", errors.New("Bearer token is required")
	// }

	tokenString, err := c.Cookie("access_token")
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func ValidateToken(tokenString string) (*SignedDetails, error) {
	claims := &SignedDetails{}
	// Verifies the signature, parses the payload, writes data to claims
	token, err := jwt.ParseWithClaims(
		tokenString,
		claims,
		func(token *jwt.Token) (interface{}, error) {

			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("Invalid signing method")
			}

			return []byte(SECRET_KEY_TOKEN), nil
		},
	)
	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	if time.Now().After(claims.ExpiresAt.Time) {
		return nil, errors.New("Token has expired")
	}

	return claims, nil

}

func GetUserIdFromContext(c *gin.Context) (string, error) {
	userId, exists := c.Get("userId")

	if !exists {
		return "", errors.New("userId does not exists in this context")
	}

	id, ok := userId.(string)

	if !ok {
		return "", errors.New("unable to retrieve userId")
	}

	return id, nil
}

func GetRoleFromContext(c *gin.Context) (string, error) {
	role, exists := c.Get("role")

	if !exists {
		return "", errors.New("Role does not exists in this context")
	}

	memberRole, ok := role.(string)

	if !ok {
		return "", errors.New("unable to retrieve role")
	}

	return memberRole, nil
}

func ValidateRefreshToken(tokenString string) (*SignedDetails, error) {
	claims := &SignedDetails{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {

		return []byte(SECRET_KEY_REFRESH_TOKEN), nil
	})

	if err != nil {
		return nil, err
	}

	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, err
	}

	if claims.ExpiresAt.Time.Before(time.Now()) {
		return nil, errors.New("refresh token has expired")
	}

	return claims, nil
}
