package models

type TMDBSerieDetails struct {
	ID               int           `json:"id"`
	Name             string        `json:"name"`
	OriginalName     string        `json:"original_name"`
	Overview         string        `json:"overview"`
	PosterPath       string        `json:"poster_path"`
	BackdropPath     string        `json:"backdrop_path"`
	FirstAirDate     string        `json:"first_air_date"`
	Status           string        `json:"status"`
	OriginalLanguage string        `json:"original_language"`
	VoteAverage      float64       `json:"vote_average"`
	VoteCount        int           `json:"vote_count"`
	Genres           []TMDBGenre   `json:"genres"`
	Credits          TMDBCredits   `json:"credits"`
	Videos           TMDBVideos    `json:"videos"`
	Networks         []TMDBNetwork `json:"networks"`
}

type TMDBNetwork struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Logo string `json:"logo_path"`
}

type TMDBSerieListResponse struct {
	Results []TMDBSerieItem `json:"results"`
}

type TMDBSerieItem struct {
	ID           int     `json:"id"`
	Name         string  `json:"name"`
	PosterPath   string  `json:"poster_path"`
	FirstAirDate string  `json:"first_air_date"`
	VoteAverage  float64 `json:"vote_average"`
}

// Serie Card
type SerieCollectionItem struct {
	ID           int     `json:"id"`
	Title        string  `json:"title"`
	PosterPath   string  `json:"poster_path"`
	FirstAirDate string  `json:"first_air_date"`
	Rating       float64 `json:"rating"`
}

// responce for HomePage
type HomeCollectionsSerieResponse struct {
	Trending []SerieCollectionItem `json:"trending"`
	TopRated []SerieCollectionItem `json:"top_rated"`
}

// response for Movies Page - collections by genres
type GenreCollectionSeries struct {
	GenreID   int                   `json:"genre_id"`
	GenreName string                `json:"genre_name"`
	Series    []SerieCollectionItem `json:"series"`
}

type SeriesPageCollectionsResponse struct {
	Collections []GenreCollectionSeries `json:"collections"`
}

// Response structure für Client
type SerieDetailsResponse struct {
	ID               int          `json:"id"`
	Title            string       `json:"title"`
	PosterPath       string       `json:"poster_path"`
	BackdropPath     string       `json:"backdrop_path"`
	TrailerKey       string       `json:"trailer_key"`
	Overview         string       `json:"overview"`
	FirstAirDate     string       `json:"first_air_date"`
	Status           string       `json:"status"`
	Network          string       `json:"network"`
	OriginalLanguage string       `json:"original_language"`
	Rating           float64      `json:"rating"`
	VoteCount        int          `json:"vote_count"`
	Genres           []TMDBGenre  `json:"genres"`
	Creator          *PersonInfo  `json:"creator"`
	Cast             []CastInfo   `json:"cast"`
	UserReviews      []UserReview `json:"user_reviews"`
}
