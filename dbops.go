package main

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"os"
	"time"
)

type Draft struct {
	Text      string    `json:"text"`
	Author    string    `json:"author"`
	CreatedAT time.Time `json:"createdAt"`
	UpdatedAT time.Time `json:"updatedAt"`
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

func GetDraft(ctx context.Context) ([]Draft, error) {
	var result []Draft
	db, err := LoadDB(ctx)
	if err != nil {
		return result, err
	}

	drafts := db.Collection("drafts")
	cur, err := drafts.Find(context.TODO(), bson.D{})
	if err != nil {
		return result, err
	}
	defer cur.Close(context.TODO())
	err = cur.All(context.TODO(), &result)
	if err != nil {
		return result, err
	}
	return result, nil
}

// function to insert a draft into the database
func InsertDraft(ctx context.Context, draft Draft) error {
	db, err := LoadDB(ctx)
	if err != nil {
		return err
	}

	drafts := db.Collection("drafts")
	_, err = drafts.InsertOne(context.TODO(), draft)
	if err != nil {
		return err
	}
	fmt.Println("Document inserted successfully")
	return nil
}
