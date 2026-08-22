package main

import (
	"path/filepath"
	"runtime"

	"github.com/joho/godotenv"
)

// LoadRootEnv loads the shared .env file at the repo root, regardless of
// the process's current working directory. Errors are silently ignored;
// environment variables can be injected via Docker env_file or environment.
func LoadRootEnv() {
	_, thisFile, _, _ := runtime.Caller(0)
	rootEnvPath := filepath.Join(filepath.Dir(thisFile), "..", ".env")
	_ = godotenv.Load(rootEnvPath)
}
