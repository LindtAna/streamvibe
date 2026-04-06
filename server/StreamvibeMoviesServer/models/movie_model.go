// Note: Go uses snake_case for file names
// Note_2: only double quotes ("") for string literals...

package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Genre struct {
	GenreID   int    `bson:"genre_id" json:"genre_id" validate:"required"`
	GenreName string `bson:"genre_name" json:"genre_name" validate:"required,min=2,max=100"`
}

type Ranking struct {
	RankingValue int    `bson:"ranking_value" json:"ranking_value" validate:"required"`
	RankingName  string `bson:"ranking_name" json:"ranking_name" validate:"required"`
}

type Movie struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	ImdbID      string        `bson:"imdb_id" json:"imdb_id" validate:"required"`
	Title       string        `bson:"title" json:"title" validate:"required,min=2,max=500"`
	PosterPath  string        `bson:"poster_path" json:"poster_path" validate:"required,url"`
	YouTubeID   string        `bson:"youtube_id" json:"youtube_id" validate:"required"`
	Genre       []Genre       `bson:"genre" json:"genre" validate:"required,dive"`
	AdminReview string        `bson:"admin_review" json:"admin_review"`
	UserReviews []UserReview  `bson:"user_reviews" json:"user_reviews"`
	Ranking     Ranking       `bson:"ranking" json:"ranking" validate:"required"`
}

type UserReview struct {
	ReviewID  bson.ObjectID `bson:"review_id" json:"review_id"`
	UserID    string        `bson:"user_id" json:"user_id"`
	UserName  string        `bson:"user_name" json:"user_name"`
	Country   string        `bson:"country" json:"country" validate:"required"`
	Rating    int           `bson:"rating" json:"rating" validate:"required,min=1,max=5"`
	Text      string        `bson:"text" json:"text" validate:"required"`
	CreatedAt time.Time     `bson:"created_at" json:"created_at"`
}
