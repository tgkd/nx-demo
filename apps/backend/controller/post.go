package controller

import (
	"github.com/gin-gonic/gin"

	"nx-demo/apps/backend/model"
	"nx-demo/apps/backend/service"
)

var err error

// @Router /posts/{id} [get]
func (base *Controller) GetPost(c *gin.Context) {
	id := c.Params.ByName("id")

	post, err := service.GetPost(base.DB, id)
	if err != nil {
		c.AbortWithStatus(404)
	}

	c.JSON(200, post)
}

// @Router /posts/ [get]
func (base *Controller) GetPosts(c *gin.Context) {
	var args model.Args

	args.Sort = c.DefaultQuery("sort", "ID")
	args.Order = c.DefaultQuery("order", "DESC")
	args.Offset = c.DefaultQuery("offset", "0")
	args.Limit = c.DefaultQuery("limit", "25")
	args.Search = c.DefaultQuery("search", "")

	posts, filteredData, totalData, err := service.GetPosts(c, base.DB, args)
	if err != nil {
		c.AbortWithStatus(404)
	}

	var paging model.Paging

	paging.FilteredData = filteredData
	paging.TotalData = totalData

	data := model.Data{
		Paging: paging,
		Data:   posts,
	}

	c.JSON(200, data)
}

// @Router /posts/ [post]
func (base *Controller) CreatePost(c *gin.Context) {
	post := new(model.Post)

	err := c.ShouldBindJSON(&post)
	if err != nil {
		c.AbortWithStatus(400)
		return
	}

	post, err = service.SavePost(base.DB, post)
	if err != nil {
		c.AbortWithStatus(404)
		return
	}

	c.JSON(200, post)
}

// @Router /posts/{id} [put]
func (base *Controller) UpdatePost(c *gin.Context) {
	id := c.Params.ByName("id")

	post, err := service.GetPost(base.DB, id)
	if err != nil {
		c.AbortWithStatus(404)
		return
	}

	err = c.ShouldBindJSON(&post)
	if err != nil {
		c.AbortWithStatus(400)
		return
	}

	post, err = service.SavePost(base.DB, post)
	if err != nil {
		c.AbortWithStatus(404)
		return
	}

	c.JSON(200, post)
}

// @Router /posts/{id} [delete]
func (base *Controller) DeletePost(c *gin.Context) {
	id := c.Params.ByName("id")

	err = service.DeletePost(base.DB, id)
	if err != nil {
		c.AbortWithStatus(404)
		return
	}

	c.JSON(200, gin.H{"id#" + id: "deleted"})
}
