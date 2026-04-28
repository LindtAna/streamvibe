package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type SupportRequest struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	FirstName string        `bson:"first_name" json:"first_name" validate:"required,min=1,max=100"`
	LastName  string        `bson:"last_name" json:"last_name" validate:"required,min=1,max=100"`
	Email     string        `bson:"email" json:"email" validate:"required,email"`
	Phone     string        `bson:"phone,omitempty" json:"phone,omitempty"`
	Message   string        `bson:"message" json:"message" validate:"required,min=10,max=2000"`
	CreatedAt time.Time     `bson:"created_at" json:"created_at"`
}

type SupportResponse struct {
	ID               bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	SupportRequestID bson.ObjectID `bson:"support_request_id" json:"support_request_id" validate:"required"`
	AdminID          bson.ObjectID `bson:"admin_id" json:"admin_id"`
	Response         string        `bson:"response" json:"response" validate:"required,min=10,max=2000"`
	SentAt           time.Time     `bson:"sent_at" json:"sent_at"`
}
