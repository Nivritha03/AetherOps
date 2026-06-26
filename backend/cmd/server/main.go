package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gpu-cost-optimizer-api/internal/api"
	"gpu-cost-optimizer-api/internal/providers"
	"gpu-cost-optimizer-api/internal/providers/mock"
	"gpu-cost-optimizer-api/internal/services"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Initialize providers (using mock provider for now)
	mockProvider := mock.NewMockProvider()
	p := &providers.Providers{
		Dashboard:      mockProvider,
		Node:           mockProvider,
		Workload:       mockProvider,
		Recommendation: mockProvider,
		Cost:           mockProvider,
		Alert:          mockProvider,
		Cluster:        mockProvider,
	}

	// Initialize service layer
	service := services.NewService(p)

	// Initialize API handler
	handler := api.NewHandler(service)

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
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
