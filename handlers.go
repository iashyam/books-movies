package main

import (
	"errors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"log"
	"net/http"
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
	result, err := books.InsertOne(c.Request.Context(), book)
	if err != nil {
		log.Printf("Error in inserting the document, %v", err)
		c.JSON(500, gin.H{"error": "Error in inserting the document"})
		return
	}
	book.ID = result.InsertedID.(bson.ObjectID)
	c.JSON(200, gin.H{"message": "Book created successfully"})
}

func (env *HandlerEnv) GetBookByIDHandler(c *gin.Context) {
	var book Book
	id := c.Param("id")
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("Invalid ID format: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	filter := bson.M{"_id": objectID}
	books := env.db.Collection("books")
	res := books.FindOne(c.Request.Context(), filter)
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

func (env *HandlerEnv) DeleteBookByIDHandler(c *gin.Context) {
	id := c.Param("id")
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("Invalid ID format: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	books := env.db.Collection("books")
	filter := bson.M{"_id": objectID}
	//first check if the book exists
	bookExists := books.FindOne(c.Request.Context(), filter)
	if err := bookExists.Decode(&Book{}); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(404, gin.H{"error": "Book not found"})
			return
		}
	}
	res, err := books.DeleteOne(c.Request.Context(), filter)
	if err != nil {
		log.Printf("Error deleting book with ID %s: %v", id, err)
		c.JSON(500, gin.H{"error": "Error deleting book"})
		return
	}
	c.JSON(200, gin.H{"message": "Book deleted successfully", "deletedCount": res.DeletedCount})
}

func (env *HandlerEnv) PatchBookByIDHandler(c *gin.Context) {
	id := c.Param("id")
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("Invalid ID format: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	var book Book
	books := env.db.Collection("books")

	err = c.ShouldBindJSON(&book)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}
	filter := bson.M{"_id": objectID}
	updateDoc := bson.M{"$set": book}

	//first check if the book exists
	bookExists := books.FindOne(c.Request.Context(), filter)
	if err := bookExists.Decode(&Book{}); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(404, gin.H{"error": "Book not found"})
			return
		}
	}

	//update the book data
	result, err := books.UpdateOne(c.Request.Context(), filter, updateDoc)
	if err != nil || result.ModifiedCount == 0 {
		c.JSON(500, gin.H{"error": "Failed to update book"})
		return
	}

	c.JSON(200, gin.H{"message": "Book updated successfully", "modifiedCount": result.ModifiedCount})
}
