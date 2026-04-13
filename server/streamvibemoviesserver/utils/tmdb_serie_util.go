package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
)

// Verwenden dieselben Konstanten wie für Filme
// const TMDBBaseURL und const TMDBImageBaseURL sind in tmdb_util.go definiert

// ruft Seriedetails von TMDB ab
func GetTMDBSerieDetails(serieID string) (*models.TMDBSerieDetails, error) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")

	if tmdbAPIKey == "" {
		return nil, errors.New("TMDB_API_KEY not set")
	}

	url := fmt.Sprintf("%s/tv/%s?append_to_response=credits,videos&language=de-DE", TMDBBaseURL, serieID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+tmdbAPIKey)

	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(res.Body)
		return nil, fmt.Errorf("TMDB API error: status %d, body: %s", res.StatusCode, string(body))
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var serieDetails models.TMDBSerieDetails
	if err := json.Unmarshal(body, &serieDetails); err != nil {
		return nil, err
	}

	return &serieDetails, nil
}

// allgemeine Funktion zum Abrufen von Listen aus TMDB
func FetchTMDBSerieList(endpoint string) ([]models.TMDBSerieItem, error) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")
	if tmdbAPIKey == "" {
		return nil, errors.New("TMDB_API_KEY not set")
	}

	url := fmt.Sprintf("%s%s", TMDBBaseURL, endpoint)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+tmdbAPIKey)

	client := &http.Client{
		Timeout: 10 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("TMDB API error: status %d", res.StatusCode)
	}

	var response models.TMDBSerieListResponse
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, err
	}

	return response.Results, nil
}

// convertiert das TMDB-Array in ein Array von SerieCards für client
func ConvertToCollectionSerieItems(items []models.TMDBSerieItem) []models.SerieCollectionItem {
	result := make([]models.SerieCollectionItem, 0, len(items))

	for _, item := range items {
		result = append(result, models.SerieCollectionItem{
			ID:           item.ID,
			Title:        item.Name,
			PosterPath:   GetPosterURL(item.PosterPath, "w500"),
			FirstAirDate: item.FirstAirDate,
			Rating:       item.VoteAverage,
		})
	}

	return result
}

// konvertiert TMDB-Daten in Response-Format
func ConvertToSerieDetailsResponse(tmdbSerie *models.TMDBSerieDetails, userReviews []models.UserReview) *models.SerieDetailsResponse {
	// Cast konvertieren (nur die ersten 12 Schauspieler)
	cast := make([]models.CastInfo, 0)
	maxCast := 12
	if len(tmdbSerie.Credits.Cast) < maxCast {
		maxCast = len(tmdbSerie.Credits.Cast)
	}

	for i := 0; i < maxCast; i++ {
		member := tmdbSerie.Credits.Cast[i]
		profileURL := GetProfileURL(member.ProfilePath, "w185")
		var profilePtr *string
		if profileURL != "" {
			profilePtr = &profileURL
		}
		cast = append(cast, models.CastInfo{
			ID:          member.ID,
			Name:        member.Name,
			ProfilePath: profilePtr,
		})
	}

	network := ""
	if len(tmdbSerie.Networks) > 0 {
		network = tmdbSerie.Networks[0].Name
	}

	return &models.SerieDetailsResponse{
		ID:               tmdbSerie.ID,
		Title:            tmdbSerie.Name,
		PosterPath:       GetPosterURL(tmdbSerie.PosterPath, "w500"),
		BackdropPath:     GetPosterURL(tmdbSerie.BackdropPath, "original"),
		TrailerKey:       FindOfficialTrailer(tmdbSerie.Videos.Results),
		Overview:         tmdbSerie.Overview,
		FirstAirDate:     tmdbSerie.FirstAirDate,
		Status:           tmdbSerie.Status,
		Network:          network,
		OriginalLanguage: tmdbSerie.OriginalLanguage,
		Rating:           tmdbSerie.VoteAverage,
		VoteCount:        tmdbSerie.VoteCount,
		Genres:           tmdbSerie.Genres,
		// Creator:          FindCreator(tmdbSerie.Credits.Crew),
		Cast:        cast,
		UserReviews: userReviews,
	}
}

// Abrufen von Filmen nach Genre
func FetchTMDBSeriesByGenre(genreID int, page int) ([]models.TMDBSerieItem, error) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")
	if tmdbAPIKey == "" {
		return nil, errors.New("TMDB_API_KEY not set")
	}

	// endpoint für Serien nach Genre
	url := fmt.Sprintf("%s/discover/tv?with_genres=%d&language=de-DE&page=%d&sort_by=popularity.desc",
		TMDBBaseURL, genreID, page)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+tmdbAPIKey)

	client := &http.Client{Timeout: 10 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("TMDB API error: status %d", res.StatusCode)
	}

	var response models.TMDBSerieListResponse
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, err
	}

	return response.Results, nil
}
