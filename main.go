package main

func main() {
	PORT := ":8080"
	r := setupRouter()
	r.Run(PORT)
}
