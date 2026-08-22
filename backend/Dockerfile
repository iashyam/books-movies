# syntax=docker/dockerfile:1
FROM golang:1.25-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/books-movies .

FROM alpine:latest
RUN apk add --no-cache ca-certificates
COPY --from=builder /out/books-movies /app/books-movies
WORKDIR /app
EXPOSE 8080
ENTRYPOINT ["/app/books-movies"]
