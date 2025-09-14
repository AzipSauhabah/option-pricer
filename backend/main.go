package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/ws", wsHandler)
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
	log.Println("✅ WebSocket backend listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
