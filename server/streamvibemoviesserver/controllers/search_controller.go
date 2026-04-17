package controllers

import (
	"net/http"
	"strconv"

	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/models"
	"github.com/LindtAna/streamvibe/server/streamvibemoviesserver/utils"
	"github.com/gin-gonic/gin"
)

// führt eine Suche nach Filmen und Serien in der TMDB API durch
// als Gin-Handler konzipiert und verarbeitet GET-Anfragen mit Suchparametern
func SearchTMDB() gin.HandlerFunc {
	return func(c *gin.Context) {
		query := c.Query("q")
		if query == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
			return
		}

		// Seitennummer auslesen (Standardwert ist 1)
		page := 1
		if pageStr := c.Query("page"); pageStr != "" {
			if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
				page = p
			}
		}

		// Suche in TMDB ausführen
		searchResults, err := utils.SearchTMDB(query, page)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search TMDB", "details": err.Error()})
			return
		}

		// Ergebnisse in Filme und Serien aufteilen
		movies := make([]models.MovieCollectionItem, 0)
		series := make([]models.SerieCollectionItem, 0)

		for _, item := range searchResults.Results {
			// Alles außer Filmen und Fernsehserien überspringen(Personen usw)
			if item.MediaType != "movie" && item.MediaType != "tv" {
				continue
			}

			if item.MediaType == "movie" {
				// Film in die MovieCollectionItem-Struktur umwandeln
				movies = append(movies, models.MovieCollectionItem{
					ID:          item.ID,
					Title:       item.Title,
					PosterPath:  utils.GetPosterURL(item.PosterPath, "w500"),
					ReleaseDate: item.ReleaseDate,
					Rating:      item.VoteAverage,
				})
			} else if item.MediaType == "tv" {
				// Serie in die SerieCollectionItem-Struktur umwandeln
				series = append(series, models.SerieCollectionItem{
					ID:           item.ID,
					Title:        item.Name,
					PosterPath:   utils.GetPosterURL(item.PosterPath, "w500"),
					FirstAirDate: item.FirstAirDate,
					Rating:       item.VoteAverage,
				})
			}
		}
		// Antwort für das Frontend zusammenstellen
		response := models.SearchResponse{
			Movies: movies,
			Series: series,
			Total:  searchResults.Total,
			Page:   searchResults.Page,
		}

		c.JSON(http.StatusOK, response)
	}
}
