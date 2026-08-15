package main

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	r := gin.Default()
	DB, err := LoadDB(context.Background())
	if err != nil {
		panic(err)
	}
	env := NewHandlerEnv(DB)
	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"Status": "Okay"})
	})

	// books handlers
	r.GET("/books", env.GetBooksHandler)
	r.GET("/books/:id", env.GetBookByIDHandler)
	r.POST("/books", env.CreateBooksHandler)
	r.DELETE("/books/:id", env.DeleteBookByIDHandler)
	r.PATCH("/books/:id", env.PatchBookByIDHandler)

	// // movies handlers
	// r.GET("/movies", GetMoviesHandler)
	// r.GET("/movies/:id", GetMoviesHandler)
	// r.POST("/movies", CreateMoviesHandler)
	//
	// // shows handlers
	// r.GET("/shows", GetShowsHandler)
	// r.GET("/shows/:id", GetShowsHandler)
	// r.POST("/shows", CreateShowsHandler)

	return r
}
