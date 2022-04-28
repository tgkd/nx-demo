package service

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"gorm.io/gorm"

	"nx-demo/apps/backend/model"
	log "nx-demo/apps/backend/pkg/logger"
)

func GetPost(db *gorm.DB, id string) (*model.Post, error) {
	var err error
	post := new(model.Post)

	if err := db.Where("id = ? ", id).Preload("Tags").First(&post).Error; err != nil {
		log.Log.Error("GetPost error: %v", zap.Error(err))
		return nil, err
	}

	return post, err
}

func GetPosts(c *gin.Context, db *gorm.DB, args model.Args) ([]model.Post, int64, int64, error) {
	posts := []model.Post{}
	var filteredData, totalData int64

	table := "posts"
	query := db.Select(table + ".*")
	query = query.Offset(Offset(args.Offset))
	query = query.Limit(Limit(args.Limit))
	query = query.Order(SortOrder(table, args.Sort, args.Order))
	query = query.Scopes(Search(args.Search))

	if err := query.Preload("Tags").Find(&posts).Error; err != nil {
		log.Log.Error("GetPosts error: %v", zap.Error(err))
		return posts, filteredData, totalData, err
	}

	query = query.Offset(0)
	query.Table(table).Count(&filteredData)
	db.Table(table).Count(&totalData)

	return posts, filteredData, totalData, nil
}

func SavePost(db *gorm.DB, post *model.Post) (*model.Post, error) {
	if err := db.Save(&post).Error; err != nil {
		log.Log.Error("SavePost error: %v", zap.Error(err))
		return post, err
	}

	return post, nil
}

func DeletePost(db *gorm.DB, id string) error {
	post := new(model.Post)
	if err := db.Where("id = ? ", id).Delete(&post).Error; err != nil {
		log.Log.Error("DeletePost (post) error: %v", zap.Error(err))
		return err
	}

	tag := new(model.Tag)
	if err := db.Where("post_id = ? ", id).Delete(&tag).Error; err != nil {
		log.Log.Error("DeletePost (tag) error: %v", zap.Error(err))
	}

	return nil
}
