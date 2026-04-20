package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
)

// Genre-Mapping: Deutsche Namen zu TMDB-IDs
var genreMovieMap = map[string]int{
	"Animation":       16,
	"Action":          28,
	"Dokumentarfilm":  99,
	"Fantasy":         14,
	"Komödie":         35,
	"Krimi":           80,
	"Science Fiction": 878,
	"Drama":           18,
	"Thriller":        53,
	"Horror":          27,
}

var genreSerieMap = map[string]int{
	"Action":           10759,
	"Animation":        16,
	"Komödie":          35,
	"Krimi":            80,
	"Doku":             99,
	"Drama":            18,
	"Sci-Fi & Fantasy": 10765,
}

// konvertiert deutsche Genre-Namen zu TMDB-IDs
func MapGenreNamesToTMDBIDs(genreNames []string, isMovie bool) []int {
	var genreIDs []int
	genreMap := genreSerieMap
	if isMovie {
		genreMap = genreMovieMap
	}

	for _, name := range genreNames {
		if id, exists := genreMap[name]; exists {
			genreIDs = append(genreIDs, id)
		}
	}

	return genreIDs
}

// ruft für jedes Genre 4 Filme ab
// 2 top-rated und 2 popular (aktueller Monat)
func FetchMovieRecommendationsByGenres(genreIDs []int) ([]models.MovieCollectionItem, error) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")
	if tmdbAPIKey == "" {
		return nil, errors.New("TMDB_API_KEY not set")
	}

	var wg sync.WaitGroup
	var mu sync.Mutex
	var allRecommendations []models.MovieCollectionItem

	// aktuelles Datum für "popular this month" Filter
	currentDate := time.Now()
	releaseGte := currentDate.AddDate(0, -1, 0).Format("2006-01-02") // vor 1 Monat
	releaseLte := currentDate.Format("2006-01-02")                   // heute

	for _, genreID := range genreIDs {
		wg.Add(2) // 2 Anfragen pro Genre (top-rated + popular)

		// top-rated Filme für dieses Genre
		go func(gID int) {
			defer wg.Done()

			url := fmt.Sprintf("%s/discover/movie?with_genres=%d&language=de-DE&sort_by=vote_average.desc&vote_count.gte=500&page=1",
				TMDBBaseURL, gID)

			items, err := fetchMovieListWithAuth(url, tmdbAPIKey)
			if err != nil {
				return
			}

			// die ersten 2 Filme nehmen
			if len(items) > 2 {
				items = items[:2]
			}

			converted := ConvertToCollectionItems(items)

			mu.Lock()
			allRecommendations = append(allRecommendations, converted...)
			mu.Unlock()
		}(genreID)

		// popular Filme dieses Monats für dieses Genre
		go func(gID int) {
			defer wg.Done()

			url := fmt.Sprintf("%s/discover/movie?with_genres=%d&language=de-DE&sort_by=popularity.desc&primary_release_date.gte=%s&primary_release_date.lte=%s&page=1",
				TMDBBaseURL, gID, releaseGte, releaseLte)

			items, err := fetchMovieListWithAuth(url, tmdbAPIKey)
			if err != nil {
				// wenn es keine neuen Filme gibt, dann einfach populäre Filme
				fallbackURL := fmt.Sprintf("%s/discover/movie?with_genres=%d&language=de-DE&sort_by=popularity.desc&page=1",
					TMDBBaseURL, gID)
				items, err = fetchMovieListWithAuth(fallbackURL, tmdbAPIKey)
				if err != nil {
					return
				}
			}

			//die ersten 2 Filme nehmen
			if len(items) > 2 {
				items = items[:2]
			}

			converted := ConvertToCollectionItems(items)

			mu.Lock()
			allRecommendations = append(allRecommendations, converted...)
			mu.Unlock()
		}(genreID)
	}

	wg.Wait()

	return allRecommendations, nil
}

// Hilfsfunktion für authentifizierte TMDB-Anfragen
func fetchMovieListWithAuth(url string, apiKey string) ([]models.TMDBMovieItem, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 10 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(res.Body)
		return nil, fmt.Errorf("TMDB API error: status %d, body: %s", res.StatusCode, string(body))
	}

	var response models.TMDBMovieListResponse
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, err
	}

	return response.Results, nil
}

// entfernt Duplikate aus den Empfehlungen
func DeduplicateMovies(movies []models.MovieCollectionItem) []models.MovieCollectionItem {
	seen := make(map[int]bool)
	var unique []models.MovieCollectionItem

	for _, movie := range movies {
		if !seen[movie.ID] {
			seen[movie.ID] = true
			unique = append(unique, movie)
		}
	}

	return unique
}

// ruft für jedes Genre 4 Serien ab
// 2 top-rated und 2 popular (aktuelles Jahr)
func FetchSerieRecommendationsByGenres(genreIDs []int) ([]models.SerieCollectionItem, error) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")
	if tmdbAPIKey == "" {
		return nil, errors.New("TMDB_API_KEY not set")
	}

	var wg sync.WaitGroup
	var mu sync.Mutex
	var allRecommendations []models.SerieCollectionItem

	// aktuelles Datum für "popular this year" Filter
	currentDate := time.Now()
	currentYear := currentDate.Year()
	airDateGte := fmt.Sprintf("%d-01-01", currentYear) // Anfang des Jahres
	airDateLte := currentDate.Format("2006-01-02")     // heute

	for _, genreID := range genreIDs {
		wg.Add(2) // 2 Anfragen pro Genre (top-rated + popular)

		// top-rated Serien für dieses Genre
		go func(gID int) {
			defer wg.Done()

			url := fmt.Sprintf("%s/discover/tv?with_genres=%d&language=de-DE&sort_by=vote_average.desc&vote_count.gte=300&page=1",
				TMDBBaseURL, gID)

			items, err := fetchSerieListWithAuth(url, tmdbAPIKey)
			if err != nil {
				return
			}

			// die ersten 2 Serien nehmen
			if len(items) > 2 {
				items = items[:2]
			}

			converted := ConvertToCollectionSerieItems(items)

			mu.Lock()
			allRecommendations = append(allRecommendations, converted...)
			mu.Unlock()
		}(genreID)

		// Popular Serien dieses Jahres für dieses Genre
		go func(gID int) {
			defer wg.Done()

			url := fmt.Sprintf("%s/discover/tv?with_genres=%d&language=de-DE&sort_by=popularity.desc&first_air_date.gte=%s&first_air_date.lte=%s&page=1",
				TMDBBaseURL, gID, airDateGte, airDateLte)

			items, err := fetchSerieListWithAuth(url, tmdbAPIKey)
			if err != nil {
				// wenn es keine neuen Serien gibt, dann einfach populäre Serien
				fallbackURL := fmt.Sprintf("%s/discover/tv?with_genres=%d&language=de-DE&sort_by=popularity.desc&page=1",
					TMDBBaseURL, gID)
				items, err = fetchSerieListWithAuth(fallbackURL, tmdbAPIKey)
				if err != nil {
					return
				}
			}

			//Nur die ersten 2 Serien nehmen
			if len(items) > 2 {
				items = items[:2]
			}

			converted := ConvertToCollectionSerieItems(items)

			mu.Lock()
			allRecommendations = append(allRecommendations, converted...)
			mu.Unlock()
		}(genreID)
	}

	wg.Wait()

	return allRecommendations, nil
}

// Hilfsfunktion für authentifizierte TMDB-Anfragen
func fetchSerieListWithAuth(url string, apiKey string) ([]models.TMDBSerieItem, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 10 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(res.Body)
		return nil, fmt.Errorf("TMDB API error: status %d, body: %s", res.StatusCode, string(body))
	}

	var response models.TMDBSerieListResponse
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, err
	}

	return response.Results, nil
}

// entfernt Duplikate aus den Empfehlungen
func DeduplicateSeries(series []models.SerieCollectionItem) []models.SerieCollectionItem {
	seen := make(map[int]bool)
	var unique []models.SerieCollectionItem

	for _, serie := range series {
		if !seen[serie.ID] {
			seen[serie.ID] = true
			unique = append(unique, serie)
		}
	}

	return unique
}
