package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	r := gin.Default()

	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"Status": "Okay"})
	})

	// books handlers
	r.GET("/books", GetBooksHandler)
	r.GET("/books/:id", GetBooksHandler)
	r.POST("/books", CreateBooksHandler)

	// movies handlers
	r.GET("/movies", GetMoviesHandler)
	r.GET("/movies/:id", GetMoviesHandler)
	r.POST("/movies", CreateMoviesHandler)

	// shows handlers
	r.GET("/shows", GetShowsHandler)
	r.GET("/shows/:id", GetShowsHandler)
	r.POST("/shows", CreateShowsHandler)

	return r
}
