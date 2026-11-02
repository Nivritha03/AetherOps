package auth

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"net/http"
	"net/mail"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	_ "modernc.org/sqlite"
)

var (
	ErrUserExists        = errors.New("a user with this email already exists")
	ErrInvalidCredentials = errors.New("invalid email address or password")
	ErrWeakPassword      = errors.New("password must be at least 8 characters and contain letters and numbers")
	ErrInvalidEmail      = errors.New("invalid email format")
	ErrPasswordsMismatch = errors.New("passwords do not match")
	ErrTokenExpired      = errors.New("reset token is invalid or has expired")
	ErrUserNotFound      = errors.New("no user found with that email address")
)

var jwtSecret = []byte("aetherops-production-signing-key-948214")

// User represents an authenticated platform user
type User struct {
	ID        int64     `json:"id"`
	FullName  string    `json:"fullName"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
}

// UserClaims is the JWT claim payload
type UserClaims struct {
	UserID   int64  `json:"uid"`
	Email    string `json:"email"`
	FullName string `json:"name"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// RateLimiter manages in-memory brute-force protection
type RateLimiter struct {
	sync.Mutex
	attempts map[string][]time.Time
	limit    int
	window   time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		attempts: make(map[string][]time.Time),
		limit:    limit,
		window:   window,
	}
	// Background cleanup of expired keys
	go func() {
		for {
			time.Sleep(rl.window)
			rl.Lock()
			now := time.Now()
			for ip, times := range rl.attempts {
				valid := []time.Time{}
				for _, t := range times {
					if now.Sub(t) < rl.window {
						valid = append(valid, t)
					}
				}
				if len(valid) == 0 {
					delete(rl.attempts, ip)
				} else {
					rl.attempts[ip] = valid
				}
			}
			rl.Unlock()
		}
	}()
	return rl
}

func (rl *RateLimiter) Allow(key string) bool {
	rl.Lock()
	defer rl.Unlock()
	now := time.Now()
	times, exists := rl.attempts[key]
	if !exists {
		rl.attempts[key] = []time.Time{now}
		return true
	}
	valid := []time.Time{}
	for _, t := range times {
		if now.Sub(t) < rl.window {
			valid = append(valid, t)
		}
	}
	if len(valid) >= rl.limit {
		rl.attempts[key] = valid
		return false
	}
	valid = append(valid, now)
	rl.attempts[key] = valid
	return true
}

// AuthStore manages user tables in SQLite
type AuthStore struct {
	db          *sql.DB
	rateLimiter *RateLimiter
}

func NewAuthStore(dbPath string) (*AuthStore, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, err
	}

	schema := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		full_name TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		role TEXT NOT NULL DEFAULT 'engineer',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS password_resets (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT NOT NULL,
		token TEXT NOT NULL,
		expires_at DATETIME NOT NULL,
		used INTEGER NOT NULL DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	if _, err := db.Exec(schema); err != nil {
		return nil, fmt.Errorf("failed creating auth schema: %w", err)
	}

	return &AuthStore{
		db:          db,
		rateLimiter: NewRateLimiter(5, 1*time.Minute), // Max 5 login attempts per minute per IP
	}, nil
}

// ValidatePasswordStrength enforces enterprise password requirements
func ValidatePasswordStrength(pwd string) error {
	if len(pwd) < 8 {
		return ErrWeakPassword
	}
	hasLetter := false
	hasDigit := false
	for _, c := range pwd {
		if (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') {
			hasLetter = true
		} else if c >= '0' && c <= '9' {
			hasDigit = true
		}
	}
	if !hasLetter || !hasDigit {
		return ErrWeakPassword
	}
	return nil
}

func (s *AuthStore) Register(fullName, email, password, confirmPassword string) (*User, string, error) {
	fullName = strings.TrimSpace(fullName)
	email = strings.ToLower(strings.TrimSpace(email))

	if fullName == "" {
		return nil, "", errors.New("full name is required")
	}
	if _, err := mail.ParseAddress(email); err != nil {
		return nil, "", ErrInvalidEmail
	}
	if password != confirmPassword {
		return nil, "", ErrPasswordsMismatch
	}
	if err := ValidatePasswordStrength(password); err != nil {
		return nil, "", err
	}

	// Check if already exists
	var count int
	err := s.db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", email).Scan(&count)
	if err != nil {
		return nil, "", err
	}
	if count > 0 {
		return nil, "", ErrUserExists
	}

	// Hash password using bcrypt cost 12
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return nil, "", fmt.Errorf("hashing password failed: %w", err)
	}

	res, err := s.db.Exec(
		"INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
		fullName, email, string(hash), "engineer",
	)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE") {
			return nil, "", ErrUserExists
		}
		return nil, "", err
	}

	userID, _ := res.LastInsertId()
	user := &User{
		ID:        userID,
		FullName:  fullName,
		Email:     email,
		Role:      "engineer",
		CreatedAt: time.Now(),
	}

	token, err := GenerateJWT(user, 7*24*time.Hour)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *AuthStore) Login(email, password string, rememberMe bool) (*User, string, error) {
	email = strings.ToLower(strings.TrimSpace(email))

	var id int64
	var fullName, hash, role string
	var createdAt time.Time

	err := s.db.QueryRow(
		"SELECT id, full_name, password_hash, role, created_at FROM users WHERE email = ?",
		email,
	).Scan(&id, &fullName, &hash, &role, &createdAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, "", ErrInvalidCredentials
		}
		return nil, "", err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return nil, "", ErrInvalidCredentials
	}

	duration := 24 * time.Hour
	if rememberMe {
		duration = 30 * 24 * time.Hour // 30 days remember me
	}

	user := &User{
		ID:        id,
		FullName:  fullName,
		Email:     email,
		Role:      role,
		CreatedAt: createdAt,
	}

	token, err := GenerateJWT(user, duration)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *AuthStore) RequestPasswordReset(email string) (string, error) {
	email = strings.ToLower(strings.TrimSpace(email))

	var count int
	if err := s.db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", email).Scan(&count); err != nil {
		return "", err
	}
	if count == 0 {
		return "", ErrUserNotFound
	}

	// Generate secure cryptographically random token
	b := make([]byte, 24)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	token := hex.EncodeToString(b)
	expiresAt := time.Now().Add(1 * time.Hour) // 1 hour expiration

	_, err := s.db.Exec(
		"INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)",
		email, token, expiresAt,
	)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *AuthStore) ResetPassword(token, newPassword, confirmPassword string) error {
	token = strings.TrimSpace(token)
	if token == "" {
		return ErrTokenExpired
	}
	if newPassword != confirmPassword {
		return ErrPasswordsMismatch
	}
	if err := ValidatePasswordStrength(newPassword); err != nil {
		return err
	}

	var email string
	var expiresAt time.Time
	var used int

	err := s.db.QueryRow(
		"SELECT email, expires_at, used FROM password_resets WHERE token = ?",
		token,
	).Scan(&email, &expiresAt, &used)
	if err != nil {
		return ErrTokenExpired
	}

	if used == 1 || time.Now().After(expiresAt) {
		return ErrTokenExpired
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), 12)
	if err != nil {
		return err
	}

	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.Exec("UPDATE users SET password_hash = ? WHERE email = ?", string(hash), email); err != nil {
		return err
	}
	if _, err := tx.Exec("UPDATE password_resets SET used = 1 WHERE token = ?", token); err != nil {
		return err
	}

	return tx.Commit()
}

func GenerateJWT(user *User, duration time.Duration) (string, error) {
	claims := UserClaims{
		UserID:   user.ID,
		Email:    user.Email,
		FullName: user.FullName,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "AetherOps-Cloud-Identity",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ParseJWT(tokenString string) (*UserClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*UserClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}

// Middleware verifies Bearer JWT token on protected endpoints
func (s *AuthStore) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Missing Authorization header",
			})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Invalid Authorization header format. Expected 'Bearer <token>'",
			})
			return
		}

		claims, err := ParseJWT(parts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Token has expired or is invalid",
			})
			return
		}

		// Inject user claims into context
		c.Set("user", claims)
		c.Next()
	}
}

// RateLimitMiddleware blocks brute force attacks on auth routes
func (s *AuthStore) RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		if !s.rateLimiter.Allow(clientIP) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error":   "Too many requests. Please wait a minute before trying again.",
			})
			return
		}
		c.Next()
	}
}
