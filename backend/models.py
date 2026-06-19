"""Pydantic models for FlipCheck API request/response schemas."""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class ItemIdentification(BaseModel):
    """AI-identified item metadata."""

    type: str = Field(..., description="Item category")
    brand: Optional[str] = None
    model: Optional[str] = None
    colorway: Optional[str] = None
    estimated_year_range: Optional[str] = None
    condition: Optional[str] = None
    condition_notes: Optional[str] = None
    confidence: float = Field(0.0, ge=0.0, le=1.0)


class PricingData(BaseModel):
    """Resale price estimates from AI analysis."""

    resale_low: float
    resale_high: float
    average: float
    currency: str = "USD"


class FlipInsight(BaseModel):
    """Flip recommendation with profit analysis and risk assessment."""

    verdict: str = Field(..., description="BUY | OFFER | SKIP")
    reason: str
    suggested_offer_low: Optional[float] = None
    suggested_offer_high: Optional[float] = None
    max_buy_price: Optional[float] = None
    risk_level: str = Field("Medium", description="Low | Medium | High")
    risk_reason: Optional[str] = None
    profit_low: Optional[float] = None
    profit_high: Optional[float] = None
    best_platform: str = "eBay"


class AnalysisResponse(BaseModel):
    """Full analysis response returned to the frontend."""

    item: ItemIdentification
    pricing: Optional[PricingData] = None
    flip_insight: Optional[FlipInsight] = None
    asking_price: Optional[float] = None
    error: Optional[str] = None
    message: Optional[str] = None


class ErrorResponse(BaseModel):
    """Structured error response — always JSON, never plain text."""

    error: str
    message: str
