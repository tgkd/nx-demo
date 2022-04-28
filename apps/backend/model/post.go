package model

import (
	"gorm.io/gorm"
)

type Paging struct {
	TotalData    int64 `json:"totalData"`
	FilteredData int64 `json:"filteredData"`
}

type Data struct {
	Paging Paging `json:"paging"`
	Data   []Post `json:"data"`
}

type Args struct {
	Sort   string `json:"sort"`
	Order  string `json:"order"`
	Offset string `json:"offset"`
	Limit  string `json:"limit"`
	Search string `json:"search"`
}

type Post struct {
	gorm.Model
	Name        string `json:"name" gorm:"type:varchar(255)"`
	Description string `json:"description"  gorm:"type:text"`
	Tags        []Tag  `json:"tags"`
}

type Tag struct {
	gorm.Model
	PostID      uint   `gorm:"index"`
	Name        string `json:"name" gorm:"type:varchar(255)"`
	Description string `json:"description" gorm:"type:text"`
}
