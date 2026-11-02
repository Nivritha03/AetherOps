package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"gpu-cost-optimizer-api/internal/api"
	"gpu-cost-optimizer-api/internal/auth"
	"gpu-cost-optimizer-api/internal/config"
	"gpu-cost-optimizer-api/internal/services"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Load configuration
	cfg, err := config.LoadConfig("config.yaml")
	if err != nil {
		log.Printf("Warning: Failed to load config.yaml, falling back to mock provider: %v", err)
		cfg = &config.Config{} // Create empty config to prevent nil pointer errors
		cfg.Provider.Type = "mock"
	}

	// Initialize AuthStore with persistent SQLite
	authStore, err := auth.NewAuthStore("cost.db")
	if err != nil {
		log.Fatalf("Failed to initialize authentication store: %v", err)
	}

	// Initialize service layer (which now initializes providers based on config)
	service := services.NewService(cfg)

	// Initialize API handler with AuthStore
	handler := api.NewHandler(service, authStore)

	r := gin.New()
	r.Use(gin.Recovery())

	// Custom Request Logging Middleware
	r.Use(func(c *gin.Context) {
		start := time.Now()
		c.Next()
		duration := time.Since(start)
		log.Printf("[API] Method: %s | Path: %s | Status: %d | Response Time: %s",
			c.Request.Method,
			c.Request.URL.Path,
			c.Writer.Status(),
			duration,
		)
	})

	// CORS middleware - strictly allow localhost during development
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin == "http://localhost:3000" {
			c.Header("Access-Control-Allow-Origin", origin)
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	handler.RegisterRoutes(r)

	log.Printf("🚀 GPU Cost Optimizer API starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
