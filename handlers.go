package main

import (
	"errors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"log"
	"net/http"
)

type Content[T Document] struct {
	collectionName string
	env            *HandlerEnv
}

func NewContent[T Document](env *HandlerEnv, collectionName string) *Content[T] {
	return &Content[T]{collectionName: collectionName, env: env}
}

func (content *Content[T]) GetAll() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []T
		cur, err := content.env.db.Collection(content.collectionName).Find(c.Request.Context(), bson.M{})
		if err != nil {
			log.Printf("Error finding in %s: %v", content.collectionName, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
			return
		}
		defer cur.Close(c.Request.Context())

		if err = cur.All(c.Request.Context(), &items); err != nil {
			log.Printf("Error decoding %s: %v", content.collectionName, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load items"})
			return
		}
		c.JSON(http.StatusOK, items)
	}
}

func (content *Content[T]) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		var item T
		if err := c.ShouldBindJSON(&item); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		result, err := content.env.db.Collection(content.collectionName).InsertOne(c.Request.Context(), item)
		if err != nil {
			log.Printf("Error inserting into %s: %v", content.collectionName, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Item created successfully", "id": result.InsertedID})
	}
}

func (content *Content[T]) GetByID() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		objectID, err := bson.ObjectIDFromHex(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			return
		}

		var item T
		err = content.env.db.Collection(content.collectionName).FindOne(c.Request.Context(), bson.M{"_id": objectID}).Decode(&item)
		if err != nil {
			if errors.Is(err, mongo.ErrNoDocuments) {
				c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching item"})
			return
		}
		c.JSON(http.StatusOK, item)
	}
}

func (content *Content[T]) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		objectID, err := bson.ObjectIDFromHex(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			return
		}

		result, err := content.env.db.Collection(content.collectionName).DeleteOne(c.Request.Context(), bson.M{"_id": objectID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item"})
			return
		}

		if result.DeletedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Item deleted successfully"})
	}
}

func (content *Content[T]) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		objectID, err := bson.ObjectIDFromHex(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			return
		}

		var item T
		if err := c.ShouldBindJSON(&item); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		result, err := content.env.db.Collection(content.collectionName).UpdateOne(
			c.Request.Context(),
			bson.M{"_id": objectID},
			bson.M{"$set": item},
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item"})
			return
		}

		if result.MatchedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Item updated successfully"})
	}
}
