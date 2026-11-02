package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gpu-cost-optimizer-api/internal/auth"
)

type RegisterRequest struct {
	FullName        string `json:"fullName" binding:"required"`
	Email           string `json:"email" binding:"required"`
	Password        string `json:"password" binding:"required"`
	ConfirmPassword string `json:"confirmPassword" binding:"required"`
}

type LoginRequest struct {
	Email      string `json:"email" binding:"required"`
	Password   string `json:"password" binding:"required"`
	RememberMe bool   `json:"rememberMe"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required"`
}

type ResetPasswordRequest struct {
	Token           string `json:"token" binding:"required"`
	Password        string `json:"password" binding:"required"`
	ConfirmPassword string `json:"confirmPassword" binding:"required"`
}

func (h *Handler) registerUser(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "All fields are required"})
		return
	}

	user, token, err := h.authStore.Register(req.FullName, req.Email, req.Password, req.ConfirmPassword)
	if err != nil {
		status := http.StatusBadRequest
		if err == auth.ErrUserExists {
			status = http.StatusConflict
		}
		c.JSON(status, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "User registered successfully",
		"token":   token,
		"user":    user,
	})
}

func (h *Handler) loginUser(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Email and password are required"})
		return
	}

	user, token, err := h.authStore.Login(req.Email, req.Password, req.RememberMe)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login successful",
		"token":   token,
		"user":    user,
	})
}

func (h *Handler) logoutUser(c *gin.Context) {
	// In a stateless JWT pattern, client clears the token; server confirms invalidation
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logout successful",
	})
}

func (h *Handler) getCurrentUser(c *gin.Context) {
	claimsVal, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Unauthorized"})
		return
	}
	claims := claimsVal.(*auth.UserClaims)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"user": gin.H{
			"id":       claims.UserID,
			"email":    claims.Email,
			"fullName": claims.FullName,
			"role":     claims.Role,
		},
	})
}

func (h *Handler) requestPasswordReset(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Email is required"})
		return
	}

	token, err := h.authStore.RequestPasswordReset(req.Email)
	if err != nil {
		// Avoid leaking whether an email exists or not, but return message
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "If that email exists in our system, a password reset link has been dispatched.",
		})
		return
	}

	// In development, also return the reset token directly so user can immediately test
	resetURL := fmt.Sprintf("http://localhost:3000/auth/reset-password?token=%s", token)

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"message":  "Password reset instructions have been generated.",
		"resetURL": resetURL,
		"token":    token,
	})
}

func (h *Handler) resetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Token and passwords are required"})
		return
	}

	if err := h.authStore.ResetPassword(req.Token, req.Password, req.ConfirmPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Your password has been successfully reset. You may now sign in.",
	})
}
