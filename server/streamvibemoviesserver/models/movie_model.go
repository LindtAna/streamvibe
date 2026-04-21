package models

// Hauptmodell für Filme in der Datenbank
type Movie struct {
	DbID             string        `bson:"db_id" json:"db_id" validate:"required"`
	Title            string        `bson:"title" json:"title" validate:"required,min=2,max=500"`
	PosterPath       string        `bson:"poster_path" json:"poster_path" validate:"required,url"`
	YouTubeID        string        `bson:"youtube_id" json:"youtube_id" validate:"required"`
	ReleaseDate      string        `bson:"release_date" json:"release_date"`
	OriginalLanguage string        `bson:"original_language" json:"original_language"`
	Director         *PersonInfoDB `bson:"director" json:"director"`
	Screenwriter     *PersonInfoDB `bson:"screenwriter" json:"screenwriter"`
	Genre            []Genre       `bson:"genre" json:"genre" validate:"required,dive"`
	Overview         string        `bson:"overview" json:"overview"`
	AdminReview      string        `bson:"admin_review" json:"admin_review"`
}

type Genre struct {
	GenreID   int    `bson:"genre_id" json:"genre_id" validate:"required"`
	GenreName string `bson:"genre_name" json:"genre_name" validate:"required,min=2,max=100"`
}

type PersonInfoDB struct {
	Name        string  `bson:"name" json:"name"`
	ProfilePath *string `bson:"profile_path" json:"profile_path"`
}

//für GetRankings in admin_ai_optional_controller
type Ranking struct {
	RankingValue int    `bson:"ranking_value" json:"ranking_value" validate:"required"`
	RankingName  string `bson:"ranking_name" json:"ranking_name" validate:"required"`
}
