"""Gemini 2.5 Flash vision service for item identification and pricing."""

from __future__ import annotations

import json
import os

import google.generativeai as genai


def _build_prompt(asking_price: float | None = None) -> str:
    """Build the structured Gemini prompt.

    The prompt asks Gemini to identify the item, estimate resale value,
    assess risk, and provide a flip verdict — all in one call.

    Args:
        asking_price: The seller's asking price, if provided by the user.

    Returns:
        The complete prompt string.
    """
    price_context = ""
    if asking_price is not None:
        price_context = f"""
The seller is asking ${asking_price:.2f} for this item.
Based on this asking price:
- Calculate "suggested_offer_low" and "suggested_offer_high" (a fair counter-offer range).
- Calculate "max_buy_price" (the absolute maximum you'd pay and still profit after ~30% platform fees + shipping).
- Calculate "profit_low" = resale_low - asking_price, and "profit_high" = resale_high - asking_price.
- Determine "verdict": "BUY" if asking_price < max_buy_price, "OFFER" if it's close but negotiable, "SKIP" if the margin is too thin or negative.
- Write "reason" referencing the asking price, resale values, and profit margin."""
    else:
        price_context = """
No asking price was provided. Set these fields to null: "suggested_offer_low", "suggested_offer_high", "max_buy_price", "profit_low", "profit_high".
For "verdict": estimate based on typical thrift store cost for this item type ($3-$10). Use "BUY" if resale is >3x typical thrift cost, "OFFER" if >1.5x, "SKIP" otherwise.
Write "reason" explaining the verdict based on resale value vs typical thrift costs."""

    return f"""You are a resale pricing expert. Analyze this image of a secondhand item.

TASK 1 — ITEM IDENTIFICATION:
Identify the item type, brand, model, colorway, condition, estimated year range, and your confidence (0.0-1.0).

TASK 2 — RESALE PRICING:
Estimate the realistic resale value range on platforms like eBay, Depop, and Mercari.
Provide "resale_low" (conservative/quick sale), "resale_high" (patient/best case), and "average".
Use USD currency.

TASK 3 — FLIP ANALYSIS:
{price_context}

TASK 4 — RISK ASSESSMENT:
Assess "risk_level" as "Low", "Medium", or "High".
Provide "risk_reason" explaining why (consider demand, authenticity concerns, condition, market saturation).

TASK 5 — BEST PLATFORM:
Recommend "best_platform" from: "eBay", "Depop", "Mercari", "Poshmark", "Grailed", "StockX".

Respond with ONLY a valid JSON object. No markdown fences, no explanation, no text outside the JSON.
Use this exact structure:
{{
  "item": {{
    "type": "sneaker | t-shirt | jacket | hoodie | pants | dress | bag | hat | accessory | other",
    "brand": "brand name or null",
    "model": "specific model name or null",
    "colorway": "color description or null",
    "estimated_year_range": "e.g. 2018-2022 or null",
    "condition": "new | excellent | good | fair | poor",
    "condition_notes": "brief visible condition details or null",
    "confidence": 0.0
  }},
  "pricing": {{
    "resale_low": 0.0,
    "resale_high": 0.0,
    "average": 0.0,
    "currency": "USD"
  }},
  "flip_insight": {{
    "verdict": "BUY | OFFER | SKIP",
    "reason": "explanation string",
    "suggested_offer_low": null,
    "suggested_offer_high": null,
    "max_buy_price": null,
    "risk_level": "Low | Medium | High",
    "risk_reason": "explanation string",
    "profit_low": null,
    "profit_high": null,
    "best_platform": "eBay"
  }}
}}"""


def _configure_client() -> None:
    """Configure the Gemini client with the API key from env."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is not set")
    genai.configure(api_key=api_key)


async def identify_and_price_item(
    image_bytes: bytes,
    mime_type: str,
    asking_price: float | None = None,
) -> dict:
    """Send an image to Gemini 2.5 Flash and get full analysis.

    Performs item identification, resale pricing, flip insight, risk
    assessment, and platform recommendation in a single API call.

    Args:
        image_bytes: Raw image bytes (JPEG/PNG/WEBP).
        mime_type: MIME type of the image.
        asking_price: Optional seller asking price for profit calculation.

    Returns:
        Raw parsed dict with 'item', 'pricing', and 'flip_insight' keys.

    Raises:
        ValueError: If Gemini returns unparseable output.
    """
    _configure_client()

    model = genai.GenerativeModel("gemini-2.5-flash")

    image_part = {
        "mime_type": mime_type,
        "data": image_bytes,
    }

    prompt = _build_prompt(asking_price)

    try:
        response = await model.generate_content_async(
            [prompt, image_part],
            generation_config=genai.types.GenerationConfig(
                temperature=0.1,
                max_output_tokens=2048,
            ),
        )
    except Exception as exc:
        raise ValueError(f"Gemini API call failed: {exc}") from exc

    raw_text = response.text.strip()

    # Strip markdown fences if Gemini wraps the response
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw_text = "\n".join(lines).strip()

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Gemini returned invalid JSON: {raw_text[:200]}"
        ) from exc

    return data
