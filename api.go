package main

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func getCORSConfig() cors.Config {
	godotenv.Load()
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	origins := strings.Split(allowedOrigins, ",")
	for i := range origins {
		origins[i] = strings.TrimSpace(origins[i])
	}

	corsConfig := cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Accept", "Origin", "Cache-Control", "X-Requested-With"},
		AllowCredentials: true,
	}
	return corsConfig
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	corsConfig := getCORSConfig()
	r.Use(cors.New(corsConfig))

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
	bookHandler := NewContent[Book](env, "books")
	r.GET("/books", bookHandler.GetAll())
	r.GET("/books/:id", bookHandler.GetByID())
	r.POST("/books", bookHandler.Create())
	r.DELETE("/books/:id", bookHandler.Delete())
	r.PATCH("/books/:id", bookHandler.Update())
	r.PATCH("/books/:id/status", bookHandler.ChangeStatus())

	// movies handlers
	movieHandler := NewContent[Movie](env, "movies")
	r.GET("/movies", movieHandler.GetAll())
	r.GET("/movies/:id", movieHandler.GetByID())
	r.POST("/movies", movieHandler.Create())
	r.DELETE("/movies/:id", movieHandler.Delete())
	r.PATCH("/movies/:id", movieHandler.Update())
	r.PATCH("/movies/:id/status", movieHandler.ChangeStatus())

	// shows handlers
	showHandler := NewContent[Show](env, "shows")
	r.GET("/shows", showHandler.GetAll())
	r.GET("/shows/:id", showHandler.GetByID())
	r.POST("/shows", showHandler.Create())
	r.DELETE("/shows/:id", showHandler.Delete())
	r.PATCH("/shows/:id", showHandler.Update())
	r.PATCH("/shows/:id/status", showHandler.ChangeStatus())

	return r
}
