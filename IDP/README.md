# 🌊 CoastWise India

> **Intelligent Beach Safety & Trip Planning Platform for Indian Coastlines**

CoastWise India is a full-stack web application that provides real-time beach intelligence — safety alerts, suitability scores, weather conditions, crowd levels, and AI-powered trip planning — for beaches across India.

![CoastWise Banner](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Interactive Map** | Light-themed Leaflet map with color-coded safety markers for all Indian beaches |
| 📊 **Dashboard** | Real-time stats — total beaches, active alerts, avg suitability score |
| ⭐ **For You** | AI-personalized beach recommendations based on your preferences |
| 🗓️ **Trip Planner** | Multi-beach itinerary builder with Haversine route optimization & PDF export |
| 🔔 **Alerts** | Live safety alerts (danger / warning / info) with severity badges |
| 👤 **Preferences** | User preference toggles (Safe, Scenic, Quiet, Adventure) |
| 🤖 **Beach AI Chatbot** | Gemini-powered assistant for beach queries, weather, and safety info |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **TypeScript** (Vite)
- **React Leaflet** — interactive map with OpenStreetMap tiles
- **React Router v7** — client-side routing
- **Lucide React** — icon library
- **jsPDF + jspdf-autotable** — PDF itinerary export
- **Vanilla CSS** — Ocean + Sand design system

### Backend
- **Node.js** + **Express 5** + **TypeScript**
- **Sequelize ORM** + **SQLite** (local) / PostgreSQL (production)
- **Google Gemini API** — AI chatbot
- **OpenWeather API** — live weather data
- **node-cache** — API response caching

---

## 🎨 Design System

Ocean + Sand theme with the following palette:

| Token | Color | Usage |
|---|---|---|
| Deep Ocean Blue | `#0B3C5D` | Sidebar background |
| Sea Teal | `#14B8A6` | Primary accent, buttons |
| Light Aqua | `#67E8F9` | Highlights |
| Background | `#F8FAFC` | Main content area |
| Safe | `#22C55E` | Low risk badges |
| Moderate | `#F59E0B` | Medium risk badges |
| Danger | `#EF4444` | High risk badges |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/Akashkr0611/coding-arena.git
cd "coding-arena/IDP"

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
PORT=3000
```

> Get a free Gemini API key at: https://makersuite.google.com/app/apikey

---

## ▶️ Running Locally

### Option A — One Click (Windows)
```
Double-click: start.bat
```

### Option B — Manual Steps

```bash
# Step 1: Build the React frontend
cd frontend
npm run build

# Step 2: Compile backend TypeScript
cd ../backend
npx tsc

# Step 3: Start the integrated server
node dist/index.js
```

Open your browser at: **http://localhost:3000**

### Option C — Development Mode (Hot Reload)

```bash
# Terminal 1 — Backend with auto-reload
cd backend
npm run dev

# Terminal 2 — Frontend Vite dev server
cd frontend
npm run dev
```

Open: **http://localhost:5173** (Vite proxies `/api` calls to backend on port 3000)

---

## 🏗️ Project Structure

```
IDP/
├── .env                    # Root environment variables
├── start.bat               # One-click Windows launcher
├── render.yaml             # Render.com deployment config
├── package.json            # Root scripts
│
├── frontend/               # React + TypeScript (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts           # Axios API client
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Dark sidebar navigation
│   │   │   └── Chatbot.tsx         # AI beach assistant widget
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Interactive map page
│   │   │   ├── Dashboard.tsx       # Stats & top beaches
│   │   │   ├── BeachDetail.tsx     # Individual beach detail
│   │   │   ├── Recommendations.tsx # Personalized beach cards
│   │   │   ├── TripPlanner.tsx     # Itinerary builder
│   │   │   ├── Alerts.tsx          # Safety alerts feed
│   │   │   └── Profile.tsx         # User preferences
│   │   ├── index.css               # Ocean theme design system
│   │   └── App.tsx                 # Router setup
│   └── vite.config.ts
│
└── backend/                # Express + TypeScript
    ├── src/
    │   ├── index.ts                # Server entry + static file serving
    │   ├── db.ts                   # Sequelize + SQLite connection
    │   ├── routes/                 # API route handlers
    │   ├── controllers/            # Business logic controllers
    │   ├── models/                 # Sequelize data models
    │   ├── services/               # Weather, tide, suitability services
    │   └── seedData.ts             # Database seed script
    └── database.sqlite             # Local SQLite database
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/beaches` | List all beaches |
| `GET` | `/api/beach/:id` | Beach details |
| `GET` | `/api/beach/:id/live-data` | Live weather + tide data |
| `GET` | `/api/beach/:id/suitability` | Suitability scores |
| `GET` | `/api/alerts/:beachId` | Safety alerts for a beach |
| `GET` | `/api/recommendations/:userId` | Personalized recommendations |
| `GET` | `/api/user/:id` | User preferences |
| `POST` | `/api/user/preferences` | Save user preferences |
| `POST` | `/api/chat` | AI chatbot message |
| `GET` | `/health` | Server health check |

---

## 🌐 Deployment (Render.com)

This project is pre-configured for **one-click deploy** on Render:

1. Fork the repo on GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` and configures everything
5. Add environment variables in Render dashboard:
   - `GEMINI_API_KEY`
   - `OPENWEATHER_API_KEY`
6. Click **Deploy** ✅

---

## 🙏 Acknowledgements

- [OpenStreetMap](https://www.openstreetmap.org/) — Map tiles
- [Google Gemini](https://deepmind.google/technologies/gemini/) — AI chatbot
- [Unsplash](https://unsplash.com/) — Beach photography
- [Lucide Icons](https://lucide.dev/) — Icon library

---

## 📄 License

MIT License © 2025 CoastWise India
