package database

import (
	"io"
	"log"
	"nx-demo/apps/backend/model"
	"os"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB    *gorm.DB
	err   error
	DBErr error
)

const (
	dbname   = ""
	username = ""
	password = ""
	host     = ""
	port     = ""
	loglevel = logger.Silent
)

type Database struct {
	*gorm.DB
}

func Setup() error {
	var db = DB

	newDBLogger := logger.New(
		log.New(getWriter(), "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  loglevel,
			IgnoreRecordNotFoundError: true,
			Colorful:                  false,
		},
	)

	db, err = gorm.Open(sqlite.Open("posts.db"), &gorm.Config{Logger: newDBLogger})

	if err != nil {
		DBErr = err
		return err
	}

	db.AutoMigrate(&model.Post{}, &model.Tag{})
	DB = db

	return nil
}

func GetDB() *gorm.DB {
	return DB
}

func GetDBErr() error {
	return DBErr
}

func getWriter() io.Writer {
	file, err := os.OpenFile("posts.db.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		return os.Stdout
	} else {
		return file
	}
}
