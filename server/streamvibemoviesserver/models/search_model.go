package models

// Antwort des TMDB API auf eine Multi-Search-Anfrage
type TMDBMultiSearchResponse struct {
	Results []TMDBSearchResult `json:"results"`
	Page    int                `json:"page"`
	Total   int                `json:"total_results"`
}

// ein einzelnes Suchergebnis aus der TMDB Multi-Suche
type TMDBSearchResult struct {
	ID           int     `json:"id"`
	MediaType    string  `json:"media_type"` // "movie" oder "tv"
	Title        string  `json:"title"`      // Titel des Films (nur bei movie gefüllt)
	Name         string  `json:"name"`       // Name der Serie (nur bei tv gefüllt)
	PosterPath   string  `json:"poster_path"`
	ReleaseDate  string  `json:"release_date"`   // Veröffentlichungsdatum des Films
	FirstAirDate string  `json:"first_air_date"` // Erstausstrahlungsdatum der Serie
	VoteAverage  float64 `json:"vote_average"`
}

// die interne Antwortstruktur
// trennt die Suchergebnisse, um die Weiterverarbeitung auf dem Frontend zu erleichtern
type SearchResponse struct {
	Movies []MovieCollectionItem `json:"movies"`
	Series []SerieCollectionItem `json:"series"`
	Total  int                   `json:"total"`
	Page   int                   `json:"page"`
}
