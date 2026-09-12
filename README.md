# FlipCheck ⚡

**AI-powered thrift store price intelligence.** Upload a photo of any secondhand item and get an instant Profit Report with BUY/OFFER/SKIP guidance.

## Features
- **Instant Profit Reports:** Get resale estimates, gross profit, and suggested offer prices.
- **BUY / OFFER / SKIP Guidance:** Actionable verdicts based on real market data.
- **Risk Assessment:** Automatic detection of high-risk items or saturated markets.
- **100% Free:** Powered entirely by the free tier of the Gemini API.

## Architecture

```
flipcheck/
├── backend/          # FastAPI (Python)
│   ├── main.py       # API routes, CORS, validation
│   ├── models.py     # Pydantic schemas
│   └── services/
│       ├── gemini.py  # Gemini vision, pricing & flip logic
│       └── pricing.py # Data formatting & fallbacks
│
└── frontend/         # React + Vite + Tailwind CSS
    └── src/
        ├── components/  # UploadZone, ItemCard, PriceReport, FlipInsight
        ├── hooks/       # useAnalyze (state machine)
        └── App.jsx      # Main layout
```

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** and npm
- **Gemini API key** — free at [Google AI Studio](https://aistudio.google.com/)

## Environment Setup

### Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your actual keys:

```
GEMINI_API_KEY=your_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend

```bash
cd frontend
cp .env.example .env
```

The default `VITE_API_URL=http://localhost:8000` should work for local development.

## Development

### Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Check health at `http://localhost:8000/health`.

### Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Usage

### `POST /api/analyze`

Upload an image to get a full price analysis:

```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "image=@photo.jpg"
```

**Response:**

```json
{
  "item": {
    "type": "sneaker",
    "brand": "Nike",
    "model": "Air Force 1 '07",
    "colorway": "White/White",
    "estimated_year_range": "2020-2023",
    "condition": "good",
    "condition_notes": "Minor creasing",
    "confidence": 0.87
  },
  "pricing": {
    "resale_low": 45.0,
    "resale_high": 75.0,
    "average": 60.0,
    "currency": "USD"
  },
  "flip_insight": {
    "verdict": "BUY",
    "reason": "Average resale $60 is 7.5x the asking price. Strong margin.",
    "suggested_offer_low": 6.0,
    "suggested_offer_high": 8.0,
    "max_buy_price": 25.0,
    "risk_level": "Low",
    "risk_reason": "Common item with consistent demand",
    "profit_low": 37.0,
    "profit_high": 67.0,
    "best_platform": "eBay"
  }
}
```

## Production Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add env var: `VITE_API_URL=https://your-backend-url.com`
5. Deploy

### Backend → Render

1. Push to GitHub
2. Create new Web Service in [Render](https://render.com)
3. Set root directory to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add all env vars from `.env.example`
7. Update `ALLOWED_ORIGINS` to include your Vercel domain

## Cost

Everything runs on free tiers:

| Service | Free Tier |
|---------|-----------|
| Gemini 2.5 Flash | 1,500 req/day |
| Vercel | Hobby tier |
| Render | Free tier (cold starts) |

## License

MIT
