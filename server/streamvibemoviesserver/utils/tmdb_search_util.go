package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
)

// führt eine Multi-Suche nach Filmen und Serien durch
// gibt eine strukturierte Antwort zurück oder einen Fehler
func SearchTMDB(query string, page int) (*models.TMDBMultiSearchResponse, error) {
	// TMDB API-Key aus den Umgebungsvariablen auslese
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")
	if tmdbAPIKey == "" {
		return nil, errors.New("TMDB_API_KEY not set")
	}
	// Validierung des Suchbegriffs
	if query == "" {
		return nil, errors.New("search query is empty")
	}

	// Suchbegriff für die URL kodieren (Sonderzeichen wie Leerzeichen, Umlaute usw. behandeln)
	encodedQuery := url.QueryEscape(query)

	// Endpoint für die Multi-Suche
	// /search/multi, um gleichzeitig Filme und Serien zu finden
	// Sprache ist Deutsch (de-DE), Erwachseneninhalte werden ausgeschlossen
	endpoint := fmt.Sprintf("%s/search/multi?query=%s&language=de-DE&page=%d&include_adult=false",
		TMDBBaseURL, encodedQuery, page)

	// HTTP-Request erstellen
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}
	// Header hinzufügen: JSON-Antwort und Authentifizierung mit Bearer-Token
	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+tmdbAPIKey)

	client := &http.Client{Timeout: 10 * time.Second}

	// Anfrage an TMDB
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("TMDB API error: status %d", res.StatusCode)
	}

	// JSON-Antwort in Go-Struktur decodieren
	var response models.TMDBMultiSearchResponse

	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, err
	}

	return &response, nil
}
