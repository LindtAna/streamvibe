package utils

import (
	"os"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
)

type SignedDetails struct {
	UserId    string
	FirstName string
	LastName  string
	Email     string
	Role      string
	jwt.RegisteredClaims
}

var SECRET_KEY_TOKEN string = os.Getenv("SECRET_KEY")
var SECRET_KEY_REFRESH_TOKEN string = os.Getenv("SECRET_KEY_REFRESH_TOKEN")

func GenerateAllTokens(email, firstName, lastName, role, userId string) (string, string, error) {
	claims := &SignedDetails{
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
		Role:      role,
		UserId:    userId,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "streamvibe",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
	signedToken, err := token.SignedString([]byte(SECRET_KEY_TOKEN))

	if err != nil {
		return "", "", err
	}

	refreshClaims := &SignedDetails{
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
		Role:      role,
		UserId:    userId,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "streamvibe",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodES256, refreshClaims)
	signedRefreshToken, err := refreshToken.SignedString([]byte(SECRET_KEY_REFRESH_TOKEN))

	if err != nil {
		return "", "", err
	}

	return signedToken, signedRefreshToken, nil
}
