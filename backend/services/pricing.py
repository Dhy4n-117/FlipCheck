"""Pricing model construction from Gemini analysis results."""

from __future__ import annotations

from typing import Optional

from models import FlipInsight, PricingData


def build_pricing(raw: dict) -> Optional[PricingData]:
    """Construct a PricingData model from the raw Gemini response.

    Args:
        raw: The full parsed dict from Gemini containing a 'pricing' key.

    Returns:
        PricingData instance, or None if pricing data is missing.
    """
    pricing_data = raw.get("pricing")
    if not pricing_data:
        return None

    return PricingData(
        resale_low=float(pricing_data.get("resale_low", 0.0)),
        resale_high=float(pricing_data.get("resale_high", 0.0)),
        average=float(pricing_data.get("average", 0.0)),
        currency=pricing_data.get("currency", "USD"),
    )


def build_flip_insight(raw: dict, asking_price: Optional[float] = None) -> Optional[FlipInsight]:
    """Construct a FlipInsight model from the raw Gemini response.

    If Gemini omitted certain fields, reasonable defaults are applied.
    When no asking_price is provided, profit and offer fields are forced
    to None regardless of what Gemini returned.

    Args:
        raw: The full parsed dict from Gemini containing a 'flip_insight' key.
        asking_price: The seller's asking price, if provided.

    Returns:
        FlipInsight instance, or None if flip insight data is missing.
    """
    insight_data = raw.get("flip_insight")
    if not insight_data:
        return None

    # When no asking_price, force profit/offer fields to None
    if asking_price is None:
        suggested_offer_low = None
        suggested_offer_high = None
        max_buy_price = None
        profit_low = None
        profit_high = None
    else:
        suggested_offer_low = _safe_float(insight_data.get("suggested_offer_low"))
        suggested_offer_high = _safe_float(insight_data.get("suggested_offer_high"))
        max_buy_price = _safe_float(insight_data.get("max_buy_price"))
        profit_low = _safe_float(insight_data.get("profit_low"))
        profit_high = _safe_float(insight_data.get("profit_high"))

    return FlipInsight(
        verdict=insight_data.get("verdict", "SKIP"),
        reason=insight_data.get("reason", "Unable to determine flip viability."),
        suggested_offer_low=suggested_offer_low,
        suggested_offer_high=suggested_offer_high,
        max_buy_price=max_buy_price,
        risk_level=insight_data.get("risk_level", "Medium"),
        risk_reason=insight_data.get("risk_reason"),
        profit_low=profit_low,
        profit_high=profit_high,
        best_platform=insight_data.get("best_platform", "eBay"),
    )


def _safe_float(value) -> Optional[float]:
    """Convert a value to float, returning None if conversion fails.

    Args:
        value: Any value that might be a number, string, or None.

    Returns:
        The float value, or None if conversion is not possible.
    """
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None
