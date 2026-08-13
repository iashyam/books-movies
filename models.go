package main

import "time"

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
)

type Book struct {
	Title     string    `json:"title"`
	Author    string    `json:"author"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
	Pages     int       `json:"pages"`
	Rating    int       `json:"rating"`
	Genre     Genre     `json:"genre"`
}

type Movie struct {
	Title     string    `json:"title"`
	Director  string    `json:"director"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
	Length    int       `json:"length"`
	Rating    int       `json:"rating"`
	Genre     Genre     `json:"genre"`
}

type Show struct {
	Title     string    `json:"title"`
	Director  string    `json:"director"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
	Seasons   int       `json:"seasons"`
	Rating    int       `json:"rating"`
	Genre     Genre     `json:"genre"`
}
