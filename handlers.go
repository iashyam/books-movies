package main

import (
	"errors"
	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
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

func (env *HandlerEnv) CreateBookByIDHandler(c *gin.Context) {
	var book Book
	id := c.Param("id")
	books := env.db.Collection("books")
	res := books.FindOne(c.Request.Context(), bson.M{"_id": id})
	if err := res.Decode(&book); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			log.Printf("Book with ID %s not found", id)
			c.JSON(404, gin.H{"error": "Book not found"})
			return
		}
		log.Printf("Error decoding book with ID %s: %v", id, err)
		c.JSON(500, gin.H{"error": "Error decoding book"})
	}
	c.JSON(200, book)
}
