package main

import (
	"path/filepath"
	"runtime"

	"github.com/joho/godotenv"
)

// LoadRootEnv loads the shared .env file at the repo root, regardless of
// the process's current working directory.
func LoadRootEnv() error {
	_, thisFile, _, _ := runtime.Caller(0)
	rootEnvPath := filepath.Join(filepath.Dir(thisFile), "..", ".env")
	return godotenv.Load(rootEnvPath)
}
