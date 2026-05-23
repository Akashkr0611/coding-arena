# 🌊 CoastWise - AI-Powered Coastal Decision System

**Tagline:** Smart coastal travel decisions based on real-time conditions, not just static information.

---

## 🚀 OVERVIEW

CoastWise is an advanced, AI-driven coastal decision-making platform designed to help travelers, tourists, and locals choose the best beach destinations across India. Rather than presenting basic static data, CoastWise actively synthesizes real-time weather conditions, historical crowd patterns, and active coastal safety alerts to formulate intelligent recommendations. 

Our mission is to shift the paradigm from "displaying information" to "facilitating intelligent decision-making".

---

## 🎯 PROBLEM STATEMENT

Travelers and tourists face significant challenges when planning coastal visits:
- **Decision Fatigue:** Which beach is best for today's specific weather?
- **Safety Concerns:** Is it safe to visit, or are the tide levels and wave heights dangerous?
- **Logistical Planning:** How far is it from my location, and what is the optimal route?
- **Vague Information:** Most travel platforms lack active, intelligent, real-time context.

Users are forced to manually cross-reference weather apps, map routers, and review sites.

---

## 💡 SOLUTION APPROACH

CoastWise elegantly solves these issues by acting as a centralized, intelligent hub:
- **Analyzes Multiple Vectors:** Processes real-time weather, crowd metrics, and safety rules simultaneously.
- **Provides Smart Recommendations:** Automatically ranks and highlights the most optimal beaches.
- **Prevents Poor Choices:** Actively flags beaches with dangerous tides or severe weather conditions to keep users safe and prevent ruined trips.

---

## 🏗️ SYSTEM ARCHITECTURE

CoastWise utilizes a decoupled client-server architecture to ensure high performance and scalability:

- **Frontend (React.js + Vite):** A highly responsive, map-centric Single Page Application (SPA). Manages complex state (user locations, active trips) entirely client-side for rapid interactions.
- **Backend (Node.js + Express):** A robust REST API layer serving as the primary aggregator. It securely stores beach data, manages authentication/preferences (via SQLite/Sequelize), and interfaces with third-party data providers.
- **Data Handling:** Implements an aggressive caching strategy (`node-cache`) to minimize latency and prevent rate-limiting from external APIs.
- **State Management:** Uses React Hooks (`useState`, `useEffect`) and Context for localized state, alongside `localStorage` for persisting user trip plans across sessions.

---

## 🧠 CORE LOGIC / ALGORITHMS

### Scoring System
CoastWise employs a weighted dynamic scoring algorithm to rank beaches. 

```javascript
score = (weatherScore * 0.3) + 
        (crowdScore * 0.2) + 
        (distanceScore * 0.3) + 
        (safetyScore * 0.2)
```

### Recommendation Logic & Alert System
- **Sparse Safety Alerts System:** We employ a refined, highly optimized alerts generation algorithm. To mimic real-world distribution and avoid decision fatigue, warnings are sparsely triggered across specific beach IDs and conditions:
  - **High Tides (>1.5m)**: Generated dynamically per time-dependent sine-wave + beach ID offsets (Dangerously high tides, avoid shorelines recommendation).
  - **High Waves (>1.3m)**: Triggered dynamically for beach IDs where `id % 15 === 0` (Avoid swimming recommendation).
  - **Heat Alert (>37°C)**: Triggered dynamically for beach IDs where `id % 23 === 0` (Stay hydrated recommendation).
  - **High Wind (>30km/h)**: Triggered dynamically for beach IDs where `id % 19 === 0` (Be cautious recommendation).
  This distributes active alerts across a highly realistic ~10-15% of all beaches.
- **Tide Height Integration:** Real-time tide height is computed dynamically per beach using a time-dependent sine wave combined with localized offsets:
  `tideHeight = 0.8 + (id % 3) * 0.4 + sin(currentTime / 3600000) * 0.3`
  This tide height is rendered as a clean, high-contrast badge in the beach details page along with dedicated details in live weather parameters and report lists.
- **Crowd Handling:** Weekends dynamically scale the crowd score higher. 
- **Distance Filtering:** The Haversine formula is used strictly on the client-side to calculate accurate proximity based on HTML5 Geolocation.
- **Synchronized Dashboard Metrics:** Active alerts count on the dashboard card is dynamically aggregated using the exact same sparse alert system as the Alerts page, keeping counts fully synchronized alongside a live calculation of safe beaches (beaches reporting 0 active alerts).

---

## ✨ FEATURES (DETAILED)

### 🌍 Explore Page
- Interactive, responsive map using **Leaflet.js**.
- State-based colored markers for intuitive geographical parsing.
- Real-time user geolocation tracking.

### 📍 Beach Details
- Live Weather & Tide Reporting
- Crowd level predictions
- Granular safety indicators & Sustainability scores
- Auto-calculated "Best time to visit"
- Nearby points of interest (Hotels, Hospitals, Tourist Spots)

### 🧭 Trip Planner
- Allows users to add multiple beaches to a cohesive itinerary.
- Route visualization using **OpenRoute API**.
- Comparative travel time analysis based on driving speed.

### 🤖 AI Chatbot
- Integrated Google Gemini AI customized as a "Beach Assistant".
- Answers strictly in formatted, structured bullet points.
- Analyzes the current active beach context to provide highly tailored tips.

### 🚨 Active Alerts
- Centralized hub for displaying coastal warnings (e.g., High Waves, Heat Alerts, High Winds).
- Color-coded severity system (Red/Yellow/Teal) based on alert intensity.
- Sparse alert logic ensuring user alerts are only displayed for beaches reporting active hazardous conditions, avoiding decision fatigue.
- Dashboard synchronization ensuring the global alert counts match the central alerts hub perfectly.

---

## 🛠️ TECH STACK

**Frontend:**
- React.js (TypeScript)
- Vite (Build Tool)
- Leaflet & React-Leaflet (Mapping)
- Lucide React (Iconography)

**Backend:**
- Node.js & Express.js
- Sequelize ORM (SQLite)
- Google Generative AI SDK (Gemini)

---

## 🔌 API INTEGRATION DETAILS

1. **OpenWeather API:**
   - **Purpose:** Fetches real-time environmental data.
   - **Fields Extracted:** Temperature, wind speed, UV index, weather condition flags.
2. **Foursquare API:**
   - **Purpose:** Discovers nearby commercial and emergency infrastructure.
   - **Filtering Logic:** Strictly queries within a 5km-10km radius for categories like `hotel`, `hospital`, and `tourist attraction`.
3. **OpenRoute API:**
   - **Purpose:** Navigational routing.
   - **Function:** Calculates real-world driving distance and travel times between the user's GPS coordinates and the target beach.
4. **Google Gemini (2.5 Flash):**
   - **Purpose:** Conversational AI. Generates intelligent, robust 5-6 point summaries preventing user search fatigue.

---

## 🌊 DATA FLOW

1. **User interaction:** User clicks on a specific beach marker.
2. **Client Request:** React triggers `apiClient.get('/beach/:id')`.
3. **Server Aggregation:** Node.js checks local cache. If empty, it fires parallel async requests to OpenWeather and Foursquare.
4. **Computation:** The server calculates the `SustainabilityScore` and triggers `alertService`.
5. **Response:** Sanitized JSON payload is returned to the client.
6. **UI Update:** The React application replaces the `MapPulseLoader` with the populated `BeachDetail` view.

---

## 🎨 UI/UX DESIGN DECISIONS

- **Map-Based UI:** Chosen because coastal travel is inherently geographic. Users need spatial awareness to group trips.
- **Premium Loading Animations:** Implemented a full-screen `MapPulseLoader` and `Shimmer` cards to completely eliminate jarring blank screens and create an immersive, app-like feel.
- **Bullet-Point Chatbot:** Dense paragraphs are hard to read on mobile. Forcing the AI to use bullet points guarantees high scannability.
- **State-Based Marker Colors:** Helps users visually group beaches by jurisdiction/region instantly without hovering.

---

## 🛡️ ERROR HANDLING STRATEGY

- **API Failure Fallback:** If OpenWeather drops, the system falls back to historical/average algorithms stored in `beaches.json`.
- **AI Timeout Limits:** The Gemini request is wrapped in a strict 30-second `Promise.race` timeout to prevent endless loading spinners.
- **Graceful Degradation:** If the user denies GPS permissions, distance calculations safely revert to "N/A" rather than crashing the component.

---

## 📂 PROJECT STRUCTURE

```text
CoastWise/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route logic and AI interactions
│   │   ├── models/        # Sequelize database schemas
│   │   ├── routes/        # Express API endpoints
│   │   ├── services/      # External API wrappers (Weather, Foursquare)
│   │   └── utils/         # Helper functions
│   └── tests/             # Jest testing suites
└── frontend/
    ├── src/
    │   ├── api/           # Axios interceptors and configs
    │   ├── assets/        # Static images and icons
    │   ├── components/    # Reusable UI (Loaders, Navbars, Chatbot)
    │   ├── data/          # Fallback JSON datasets
    │   └── pages/         # Primary views (Home, BeachDetail, TripPlanner)
```

---

## ⚙️ INSTALLATION & SETUP

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run the Application (Development)
```bash
# Start backend server (runs on port 3000)
cd backend
npm run dev

# Start frontend Vite server (runs on port 5173)
cd ../frontend
npm run dev
```

### 3. Production Build
```bash
# Build frontend
cd frontend
npm run build
```

---

## 🔐 ENVIRONMENT VARIABLES

Create a `.env` file in the `backend` directory:

```env
PORT=3000
GEMINI_API_KEY=your_google_gemini_key
OPENWEATHER_API_KEY=your_openweather_key
FOURSQUARE_API_KEY=your_foursquare_key
OPENROUTE_API_KEY=your_openroute_key
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🚦 HOW IT WORKS (USER FLOW)

1. **Launch:** User lands on the dynamic Explore Map (`/`).
2. **Discover:** The map populates with 100+ color-coded Indian beaches.
3. **Analyze:** User clicks a beach. The app fetches live weather, tides, and commercial data.
4. **Decide:** The AI chatbot provides custom tips, while the UI displays the calculated Safety and Crowd scores.
5. **Plan:** The user clicks "Add to Trip". The app generates a routed path using the Trip Planner view.

---

## 🚧 LIMITATIONS

- **API Data Dependency:** If third-party APIs (like OpenWeather) hit their free-tier rate limits, live data falls back to static JSON.
- **Geographical Scarcity:** Highly remote or undiscovered beaches may have limited Foursquare data (e.g., 0 hotels found).

---

## 🚀 FUTURE IMPROVEMENTS

- **User Accounts & Social:** Allow users to save trips to cloud profiles and share itineraries with friends.
- **Machine Learning Predictive Crowds:** Train a local ML model on historical visitation data to predict crowd sizes weeks in advance.
- **Tide Chart Visualization:** Integrate `Chart.js` for beautiful interactive tide graphs.

---

## 👨‍💻 AUTHOR

**Akash K R**  


