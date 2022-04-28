package router

import (
	"io"
	"os"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"gorm.io/gorm"

	"nx-demo/apps/backend/controller"
	log "nx-demo/apps/backend/pkg/logger"
)

func Setup(db *gorm.DB) *gin.Engine {
	r := gin.New()

	f, err := os.OpenFile("posts.access.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Log.Error("Failed to create access log file: %v", zap.Error(err))
	} else {
		gin.DefaultWriter = io.MultiWriter(f)
	}

	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.Use(CORS())
	r.Use(gzip.Gzip(gzip.DefaultCompression))
	r.Use(Security())

	api := controller.Controller{DB: db}

	posts := r.Group("/posts")
	{
		posts.GET("/", api.GetPosts)
		posts.GET("/:id", api.GetPost)
		posts.POST("/", api.CreatePost)
		posts.PUT("/:id", api.UpdatePost)
		posts.DELETE("/:id", api.DeletePost)
	}

	return r
}

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func Security() gin.HandlerFunc {
	return func(c *gin.Context) {
		// X-XSS-Protection
		c.Writer.Header().Add("X-XSS-Protection", "1; mode=block")

		// HTTP Strict Transport Security
		c.Writer.Header().Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

		// X-Frame-Options
		c.Writer.Header().Add("X-Frame-Options", "SAMEORIGIN")

		// X-Content-Type-Options
		c.Writer.Header().Add("X-Content-Type-Options", "nosniff")

		// Content Security Policy
		c.Writer.Header().Add("Content-Security-Policy", "default-src 'self';")

		// X-Permitted-Cross-Domain-Policies
		c.Writer.Header().Add("X-Permitted-Cross-Domain-Policies", "none")

		// Referrer-Policy
		c.Writer.Header().Add("Referrer-Policy", "no-referrer")

		// Feature-Policy
		c.Writer.Header().Add("Feature-Policy", "microphone 'none'; camera 'none'")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
