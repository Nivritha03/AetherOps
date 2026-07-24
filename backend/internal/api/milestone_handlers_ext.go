package api

import (
	"github.com/gin-gonic/gin"
)

func (h *Handler) resolveRecommendation(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Title      string  `json:"title"`
		MoneySaved float64 `json:"moneySaved"`
	}
	if err := c.BindJSON(&req); err != nil {
		errorResponse(c, err)
		return
	}
	err := h.service.ResolveRecommendation(id, req.Title, req.MoneySaved)
	if err != nil {
		errorResponse(c, err)
		return
	}
	successResponse(c, map[string]string{"status": "resolved"})
}

func (h *Handler) getResolvedRecommendations(c *gin.Context) {
	recs, err := h.service.GetResolvedRecommendations()
	if err != nil {
		errorResponse(c, err)
		return
	}
	saved, _ := h.service.GetResolvedMoneySaved()
	successResponse(c, map[string]interface{}{
		"recommendations": recs,
		"totalSaved":      saved,
	})
}

func (h *Handler) applyAction(c *gin.Context) {
	var req struct {
		RecommendationID string `json:"recommendationId"`
	}
	if err := c.BindJSON(&req); err != nil {
		errorResponse(c, err)
		return
	}
	diff, err := h.service.ApplyAction(req.RecommendationID)
	if err != nil {
		errorResponse(c, err)
		return
	}
	successResponse(c, diff)
}

func (h *Handler) chatAssistant(c *gin.Context) {
	var req struct {
		Prompt string `json:"prompt"`
	}
	if err := c.BindJSON(&req); err != nil {
		errorResponse(c, err)
		return
	}
	reply, err := h.service.ChatAssistant(req.Prompt)
	if err != nil {
		errorResponse(c, err)
		return
	}
	successResponse(c, map[string]string{"reply": reply})
}
