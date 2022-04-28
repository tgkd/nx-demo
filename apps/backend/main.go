package main

import (
	"nx-demo/apps/backend/pkg/database"
	log "nx-demo/apps/backend/pkg/logger"
	"nx-demo/apps/backend/pkg/router"

	"go.uber.org/zap"
)

const (
	host = "127.0.0.1"
	port = "8080"
)

func main() {
	log.InitLogger()

	if err := database.Setup(); err != nil {
		log.Log.Error("database.Setup() error: %s", zap.Error(err))
	}

	db := database.GetDB()
	r := router.Setup(db)
	r.Run(host + ":" + port)
}
