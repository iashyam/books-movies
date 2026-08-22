.PHONY: help install dev dev-backend dev-frontend build build-backend build-frontend lint lint-frontend test fmt clean

help:
	@echo "Targets:"
	@echo "  install         Install frontend dependencies (yarn)"
	@echo "  dev             Run backend and frontend dev servers together"
	@echo "  dev-backend     Run Go backend (go run .)"
	@echo "  dev-frontend    Run Next.js dev server"
	@echo "  build           Build backend binary and frontend"
	@echo "  build-backend   Build Go binary"
	@echo "  build-frontend  Build Next.js production bundle"
	@echo "  lint            Lint frontend"
	@echo "  fmt             Format Go source"
	@echo "  clean           Remove build artifacts"

install:
	cd frontend && yarn install

dev:
	$(MAKE) -j2 dev-backend dev-frontend

dev-backend:
	cd backend && go run .

dev-frontend:
	cd frontend && yarn dev

build: build-backend build-frontend

build-backend:
	cd backend && go build -o books-movies .

build-frontend:
	cd frontend && yarn build

lint: lint-frontend

lint-frontend:
	cd frontend && yarn lint

fmt:
	cd backend && go fmt ./...

clean:
	rm -f backend/books-movies
	rm -rf frontend/.next
