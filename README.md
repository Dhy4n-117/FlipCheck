# FlipCheck ⚡

**AI-powered thrift store price intelligence.** Upload a photo of any secondhand item and get instant resale market pricing.

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
- **eBay developer account** — free at [eBay Developer Portal](https://developer.ebay.com/)

## Environment Setup

### Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your actual keys:

```
GEMINI_API_KEY=your_key_here
EBAY_APP_ID=your_app_id_here
EBAY_CERT_ID=your_cert_id_here
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
    "condition": "good",
    "confidence": 0.87
  },
  "pricing": {
    "floor": 18.00,
    "average": 32.00,
    "ceiling": 55.00,
    "sample_size": 34
  },
  "flip_insight": {
    "verdict": "strong_flip",
    "reason": "Average resale $32 is 4.0x the typical thrift cost of $8.",
    "suggested_platform": "eBay"
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
| Gemini 2.0 Flash | 1,500 req/day |
| eBay Browse API | 5,000 calls/day |
| Vercel | Hobby tier |
| Render | Free tier (cold starts) |

## License

MIT
