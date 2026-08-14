package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func (env *HandlerEnv) GetBooksHandler(c *gin.Context) {
	var books []Book

	cur, err := env.db.Collection("books").Find(c.Request.Context(), bson.M{})
	if err != nil {
		log.Printf("Some error in the finding collection in db: %v", err)
		c.JSON(500, gin.H{"error": "Failed to find books in database"})
		return
	}

	defer cur.Close(c.Request.Context())
	err = cur.All(c.Request.Context(), &books)
	if err != nil {
		log.Printf("Failed to load database: %v", err)
		c.JSON(500, gin.H{"error": "Failed to load books from database"})
		return
	}

	c.JSON(200, books)
}

func (env *HandlerEnv) CreateBooksHandler(c *gin.Context) {
	var book Book
	if err := c.ShouldBindJSON(&book); err != nil {
		log.Printf("Failed to bind JSON: %v", err)
		c.JSON(500, gin.H{"error": "Failed to bind JSON."})
		return
	}
	books := env.db.Collection("books")
	_, err := books.InsertOne(c.Request.Context(), book)
	if err != nil {
		log.Printf("Error in inserting the document, %v", err)
		c.JSON(500, gin.H{"error": "Error in inserting the document"})
		return
	}
	c.JSON(200, gin.H{"message": "Book created successfully"})
}
