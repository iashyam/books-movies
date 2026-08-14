package main

import (
	"context"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"os"
	"time"
)

type HandlerEnv struct {
	db *mongo.Database
}

func NewHandlerEnv(db *mongo.Database) *HandlerEnv {
	return &HandlerEnv{db: db}
}

var Client *mongo.Client
var DB *mongo.Database

func LoadDB(ctx context.Context) (*mongo.Database, error) {
	if err := godotenv.Load(); err != nil {
		return nil, err
	}

	uri := os.Getenv("MONGODB_URI")
	ctxc, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	Client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}

	if err := Client.Ping(ctxc, nil); err != nil {
		return nil, err
	}

	dbname := os.Getenv("MONGODB_DB")
	DB := Client.Database(dbname)
	return DB, nil

}
