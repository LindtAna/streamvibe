package models

type TMDBMovieDetails struct {
	ID               int         `json:"id"`
	Title            string      `json:"title"`
	OriginalTitle    string      `json:"original_title"`
	Overview         string      `json:"overview"`
	PosterPath       string      `json:"poster_path"`
	BackdropPath     string      `json:"backdrop_path"`
	ReleaseDate      string      `json:"release_date"`
	OriginalLanguage string      `json:"original_language"`
	VoteAverage      float64     `json:"vote_average"`
	VoteCount        int         `json:"vote_count"`
	Genres           []TMDBGenre `json:"genres"`
	Credits          TMDBCredits `json:"credits"`
	Videos           TMDBVideos  `json:"videos"`
}

type TMDBGenre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type TMDBCredits struct {
	Cast []TMDBCastMember `json:"cast"`
	Crew []TMDBCrewMember `json:"crew"`
}

type TMDBCastMember struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	ProfilePath *string `json:"profile_path"`
}

type TMDBCrewMember struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Job         string  `json:"job"`
	ProfilePath *string `json:"profile_path"`
}

type TMDBVideos struct {
	Results []TMDBVideo `json:"results"`
}

type TMDBVideo struct {
	Key      string `json:"key"`
	Site     string `json:"site"`
	Type     string `json:"type"`
	Name     string `json:"name"`
	Official bool   `json:"official"`
}

// Response structure für Client
type MovieDetailsResponse struct {
	ID               int          `json:"id"`
	Title            string       `json:"title"`
	PosterPath       string       `json:"poster_path"`
	BackdropPath     string       `json:"backdrop_path"`
	TrailerKey       string       `json:"trailer_key"`
	Overview         string       `json:"overview"`
	ReleaseDate      string       `json:"release_date"`
	OriginalLanguage string       `json:"original_language"`
	Rating           float64      `json:"rating"`
	VoteCount        int          `json:"vote_count"`
	Genres           []TMDBGenre  `json:"genres"`
	Director         *PersonInfo  `json:"director"`
	Composer         *PersonInfo  `json:"composer"`
	Cast             []CastInfo   `json:"cast"`
	UserReviews      []UserReview `json:"user_reviews"`
}

type PersonInfo struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	ProfilePath *string `json:"profile_path"`
}

type CastInfo struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Character   string  `json:"character"`
	ProfilePath *string `json:"profile_path"`
}

type TMDBMovieListResponse struct {
	Results []TMDBMovieItem `json:"results"`
}

type TMDBMovieItem struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	PosterPath  string  `json:"poster_path"`
	ReleaseDate string  `json:"release_date"`
	VoteAverage float64 `json:"vote_average"`
}

// MovieCards
type MovieCollectionItem struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	PosterPath  string  `json:"poster_path"`
	ReleaseDate string  `json:"release_date"`
	Rating      float64 `json:"rating"`
}

// responce for HomePage
type HomeCollectionsResponse struct {
	Trending   []MovieCollectionItem `json:"trending"`
	TopRated   []MovieCollectionItem `json:"top_rated"`
	NowPlaying []MovieCollectionItem `json:"now_playing"`
}

// response for Movies Page - collections by genres
type GenreCollection struct {
	GenreID   int                   `json:"genre_id"`
	GenreName string                `json:"genre_name"`
	Movies    []MovieCollectionItem `json:"movies"`
}

type MoviesPageCollectionsResponse struct {
	Collections []GenreCollection `json:"collections"`
}
