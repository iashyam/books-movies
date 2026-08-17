package main

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"time"
)

type Item interface {
	setID(bson.ObjectID)
	getID() bson.ObjectID
}

type Document interface {
	GetID() bson.ObjectID
	SetID(bson.ObjectID)
}

type Genre int

const (
	AnyBook Genre = iota
	Travel
	Thriller
	ScienceFiction
	PopularScience
	Classic
	MagicRealism
	CotemporaryFiction
	Fantasy
)

type BookList struct {
	ID    bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Books []Book        `bson:"books" json:"books"`
}

type MoviesList struct {
	ID     bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Movies []Movie       `bson:"movies" json:"movies"`
}

type Book struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Title     string        `bson:"title" json:"title"`
	Author    string        `bson:"author" json:"author"`
	StartDate time.Time     `bson:"startDate" json:"startDate"`
	EndDate   time.Time     `bson:"endDate" json:"endDate"`
	Status    string        `bson:"status" json:"status"`
	Pages     int           `bson:"pages" json:"pages"`
	Genre     Genre         `bson:"genre" json:"genre"`
}

type Movie struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Title     string        `bson:"title" json:"title"`
	Director  string        `bson:"director" json:"director"`
	StartDate time.Time     `bson:"startDate" json:"startDate"`
	EndDate   time.Time     `bson:"endDate" json:"endDate"`
	Status    string        `bson:"status" json:"status"`
	Length    int           `bson:"length" json:"length"`
	Genre     Genre         `bson:"genre" json:"genre"`
}

type Show struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Title     string        `bson:"title" json:"title"`
	Director  string        `bson:"director" json:"director"`
	StartDate time.Time     `bson:"startDate" json:"startDate"`
	EndDate   time.Time     `bson:"endDate" json:"endDate"`
	Seasons   int           `bson:"seasons" json:"seasons"`
	Status    string        `bson:"status" json:"status"`
	Genre     Genre         `bson:"genre" json:"genre"`
}

func (b Book) GetID() bson.ObjectID   { return b.ID }
func (b Book) SetID(id bson.ObjectID) { b.ID = id }

func (m Movie) GetID() bson.ObjectID   { return m.ID }
func (m Movie) SetID(id bson.ObjectID) { m.ID = id }

func (s Show) GetID() bson.ObjectID   { return s.ID }
func (s Show) SetID(id bson.ObjectID) { s.ID = id }
