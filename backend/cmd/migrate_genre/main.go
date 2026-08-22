// One-time migration: movies/shows previously shared the literary Genre enum
// with books. Genre is stored in MongoDB as a raw int (no BSON string codec),
// so introducing a movie/show-specific WatchGenre enum with a different
// ordering would silently relabel every existing movie/show. This script
// remaps the old int values to their new WatchGenre equivalents in place.
//
// Run once, before deploying the backend with the new WatchGenre enum:
//
//	cd backend && go run ./cmd/migrate_genre
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// old literary Genre enum order (models.go, pre-migration):
// 0 AnyBook, 1 Travel, 2 Thriller, 3 ScienceFiction, 4 PopularScience,
// 5 Classic, 6 MagicRealism, 7 CotemporaryFiction, 8 Fantasy
//
// new WatchGenre enum order (models.go, post-migration):
// 0 General, 1 Action, 2 Comedy, 3 Drama, 4 Horror, 5 Thriller, 6 Romance,
// 7 Documentary, 8 Animation, 9 Crime, 10 SciFi, 11 Fantasy, 12 Mystery,
// 13 Adventure, 14 Family
var oldToNew = map[int32]int32{
	0: 0,  // AnyBook -> General
	1: 7,  // Travel -> Documentary
	2: 5,  // Thriller -> Thriller
	3: 10, // ScienceFiction -> SciFi
	4: 7,  // PopularScience -> Documentary
	5: 3,  // Classic -> Drama
	6: 11, // MagicRealism -> Fantasy
	7: 3,  // CotemporaryFiction -> Drama
	8: 11, // Fantasy -> Fantasy
}

func loadRootEnv() error {
	_, thisFile, _, _ := runtime.Caller(0)
	rootEnvPath := filepath.Join(filepath.Dir(thisFile), "..", "..", "..", ".env")
	return godotenv.Load(rootEnvPath)
}

func migrateCollection(ctx context.Context, coll *mongo.Collection, name string) error {
	cur, err := coll.Find(ctx, bson.M{})
	if err != nil {
		return fmt.Errorf("find %s: %w", name, err)
	}
	defer cur.Close(ctx)

	var docs []bson.M
	if err := cur.All(ctx, &docs); err != nil {
		return fmt.Errorf("decode %s: %w", name, err)
	}

	updated := 0
	skipped := 0
	for _, doc := range docs {
		id := doc["_id"]

		rawGenre, ok := doc["genre"]
		if !ok {
			skipped++
			continue
		}

		var oldVal int32
		switch v := rawGenre.(type) {
		case int32:
			oldVal = v
		case int64:
			oldVal = int32(v)
		case int:
			oldVal = int32(v)
		default:
			log.Printf("%s %v: genre field is %T (%v), skipping", name, id, rawGenre, rawGenre)
			skipped++
			continue
		}

		newVal, ok := oldToNew[oldVal]
		if !ok {
			log.Printf("%s %v: unmapped old genre value %d, skipping", name, id, oldVal)
			skipped++
			continue
		}

		_, err := coll.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": bson.M{"genre": newVal}})
		if err != nil {
			return fmt.Errorf("update %s %v: %w", name, id, err)
		}
		updated++
	}

	log.Printf("%s: updated %d, skipped %d (of %d total)", name, updated, skipped, len(docs))
	return nil
}

func main() {
	if err := loadRootEnv(); err != nil {
		log.Fatalf("load .env: %v", err)
	}

	uri := os.Getenv("MONGODB_URI")
	dbname := os.Getenv("MONGODB_DB")
	if uri == "" || dbname == "" {
		log.Fatal("MONGODB_URI / MONGODB_DB not set")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("connect: %v", err)
	}
	defer client.Disconnect(ctx)

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("ping: %v", err)
	}

	db := client.Database(dbname)

	if err := migrateCollection(ctx, db.Collection("movies"), "movies"); err != nil {
		log.Fatal(err)
	}
	if err := migrateCollection(ctx, db.Collection("shows"), "shows"); err != nil {
		log.Fatal(err)
	}

	log.Println("migration complete")
}
