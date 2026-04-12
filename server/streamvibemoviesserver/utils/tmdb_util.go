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

const (
	TMDBBaseURL      = "https://api.themoviedb.org/3"
	TMDBImageBaseURL = "https://image.tmdb.org/t/p"
)

// ruft Filmdetails von TMDB ab
func GetTMDBMovieDetails(movieID string) (*models.TMDBMovieDetails, error) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")

	if tmdbAPIKey == "" {
		return nil, errors.New("TMDB_API_KEY not set")
	}

	url := fmt.Sprintf("%s/movie/%s?append_to_response=credits,videos&language=de-DE", TMDBBaseURL, movieID)

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

	var movieDetails models.TMDBMovieDetails
	if err := json.Unmarshal(body, &movieDetails); err != nil {
		return nil, err
	}

	return &movieDetails, nil
}

// generiert die vollständige Poster-URL
func GetPosterURL(posterPath string, size string) string {
	if posterPath == "" {
		return ""
	}
	// Verfügbare Größen: w92, w154, w185, w342, w500, w780, original
	if size == "" {
		size = "w500"
	}
	return fmt.Sprintf("%s/%s%s", TMDBImageBaseURL, size, posterPath)
}

// generiert die vollständige Profilbild-URL
func GetProfileURL(profilePath *string, size string) string {
	if profilePath == nil || *profilePath == "" {
		return ""
	}
	// Verfügbare Größen: w45, w185, h632, original
	if size == "" {
		size = "w185"
	}
	return fmt.Sprintf("%s/%s%s", TMDBImageBaseURL, size, *profilePath)
}

// sucht den Regisseur in der Crew
func FindDirector(crew []models.TMDBCrewMember) *models.PersonInfo {
	for _, member := range crew {
		if member.Job == "Director" {
			profileURL := GetProfileURL(member.ProfilePath, "w185")
			var profilePtr *string
			if profileURL != "" {
				profilePtr = &profileURL
			}
			return &models.PersonInfo{
				ID:          member.ID,
				Name:        member.Name,
				ProfilePath: profilePtr,
			}
		}
	}
	return nil
}

// sucht den Komponisten in der Crew
func FindComposer(crew []models.TMDBCrewMember) *models.PersonInfo {
	for _, member := range crew {
		if member.Job == "Original Music Composer" || member.Job == "Music" {
			profileURL := GetProfileURL(member.ProfilePath, "w185")
			var profilePtr *string
			if profileURL != "" {
				profilePtr = &profileURL
			}
			return &models.PersonInfo{
				ID:          member.ID,
				Name:        member.Name,
				ProfilePath: profilePtr,
			}
		}
	}
	return nil
}

// sucht den offiziellen YouTube-Trailer
func FindOfficialTrailer(videos []models.TMDBVideo) string {
	// Zuerst nach offiziellem Trailer suchen
	for _, video := range videos {
		if video.Site == "YouTube" && video.Type == "Trailer" && video.Official {
			return video.Key
		}
	}

	// Falls kein offizieller gefunden, nach beliebigem Trailer suchen
	for _, video := range videos {
		if video.Site == "YouTube" && video.Type == "Trailer" {
			return video.Key
		}
	}

	return ""
}

// konvertiert TMDB-Daten in unser Response-Format
func ConvertToMovieDetailsResponse(tmdbMovie *models.TMDBMovieDetails, userReviews []models.UserReview) *models.MovieDetailsResponse {
	// Cast konvertieren (nur die ersten 12 Schauspieler)
	cast := make([]models.CastInfo, 0)
	maxCast := 12
	if len(tmdbMovie.Credits.Cast) < maxCast {
		maxCast = len(tmdbMovie.Credits.Cast)
	}

	for i := 0; i < maxCast; i++ {
		member := tmdbMovie.Credits.Cast[i]
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

	return &models.MovieDetailsResponse{
		ID:               tmdbMovie.ID,
		Title:            tmdbMovie.Title,
		PosterPath:       GetPosterURL(tmdbMovie.PosterPath, "w500"),
		BackdropPath:     GetPosterURL(tmdbMovie.BackdropPath, "original"),
		TrailerKey:       FindOfficialTrailer(tmdbMovie.Videos.Results),
		Overview:         tmdbMovie.Overview,
		ReleaseDate:      tmdbMovie.ReleaseDate,
		OriginalLanguage: tmdbMovie.OriginalLanguage,
		Rating:           tmdbMovie.VoteAverage,
		VoteCount:        tmdbMovie.VoteCount,
		Genres:           tmdbMovie.Genres,
		Director:         FindDirector(tmdbMovie.Credits.Crew),
		Composer:         FindComposer(tmdbMovie.Credits.Crew),
		Cast:             cast,
		UserReviews:      userReviews,
	}
}

// allgemeine Funktion zum Abrufen von Listen aus TMDB
func FetchTMDBMovieList(endpoint string) ([]models.TMDBMovieItem, error) {
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

	client := &http.Client{Timeout: 10 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("TMDB API error: status %d", res.StatusCode)
	}

	var response models.TMDBMovieListResponse
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, err
	}

	return response.Results, nil
}

// Abrufen von Filmen nach Genre
func FetchTMDBMoviesByGenre(genreID int, page int) ([]models.TMDBMovieItem, error) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")
	if tmdbAPIKey == "" {
		return nil, errors.New("TMDB_API_KEY not set")
	}

	// endpoint für Filme nach Genre
	url := fmt.Sprintf("%s/discover/movie?with_genres=%d&language=de-DE&page=%d&sort_by=popularity.desc",
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

	var response models.TMDBMovieListResponse
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, err
	}

	return response.Results, nil
}

// convertiert das TMDB-Array in ein Array von MovieCards für client
func ConvertToCollectionItems(items []models.TMDBMovieItem) []models.MovieCollectionItem {
	result := make([]models.MovieCollectionItem, 0, len(items))

	for _, item := range items {
		result = append(result, models.MovieCollectionItem{
			ID:          item.ID,
			Title:       item.Title,
			PosterPath:  GetPosterURL(item.PosterPath, "w500"),
			ReleaseDate: item.ReleaseDate,
			Rating:      item.VoteAverage,
		})
	}

	return result
}
