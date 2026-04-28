package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
)

type Admin struct {
	ID         bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	AdminID    string        `bson:"admin_id" json:"admin_id"`
	AdminName  string        `bson:"admin_name" json:"admin_name" validate:"required,min=3,max=50"`
	AdminEmail string        `bson:"admin_email" json:"admin_email" validate:"required,email"`
	Password   string        `bson:"password" json:"password" validate:"required,min=6"`
}
