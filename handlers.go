package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func GetBooksHandler(c *gin.Context) []Book {
	var books []Book
	// Implementation for getting books
	db, err := LoadDB(c.Request.Context())
	if err != nil {
		log.Printf("Failed to load database: %v", err)
	}
	cur, err := db.Collection("books").Find(c.Request.Context(), bson.M{})
	defer cur.Close(c.Request.Context())
	if err != nil {
		log.Printf("Some error in the finding collection in db: %v", err)
	}

	err = cur.All(c.Request.Context(), &books)
	if err != nil {
		log.Printf("Failed to load database: %v", err)
	}

	return books
}
