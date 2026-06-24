# CoastWise – India Beach Intelligence Platform

A web application that provides recreational suitability insights for beaches across India using real-time data.

## Features
- Interactive map with 100+ beaches
- Beach details page (weather, tide, waves)
- Sustainability score
- Nearby hotels & hospitals (Geoapify API)
- Nearby tourist places
- Trip planner
- AI chatbot (Gemini API)
- Alerts system

# TECH STACK 🛠️

## 🌐 Frontend

### React.js
- Used to build a dynamic and responsive user interface
- Handles component-based architecture for scalability
- Enables real-time updates (e.g., preferences → For You page)

### Vite
- Fast development server and build tool
- Provides instant hot module replacement (HMR)
- Optimizes performance and build time

### Tailwind CSS
- Utility-first CSS framework
- Used for rapid UI development and consistent styling
- Helps maintain responsive and clean design

### React-Leaflet / Leaflet
- Used to render interactive maps
- Displays beach locations across India
- Handles markers, popups, and user interactions

## 🖥️ Backend

### Node.js
- JavaScript runtime for server-side logic
- Handles API requests and data processing

### Express.js
- Lightweight backend framework
- Manages routes such as:
  - /api/chat
  - /api/nearby
- Handles request/response flow efficiently

## 🗄️ Database

### SQLite (via Sequelize)
- Lightweight relational database
- Stores beach data and application-related information
- Sequelize used as ORM for easy data handling

## 🔌 APIs & Integrations

### OpenWeather API
- Provides real-time weather data
- Used for temperature, humidity, wind conditions

### Stormglass API
- Provides ocean data
- Used for wave height, tide levels, and marine conditions

### Geoapify Places API
- Used to fetch nearby:
  - Hotels
  - Hospitals
  - Tourist places
- Supports location-based filtering

### Gemini AI API
- Powers chatbot functionality
- Provides context-aware responses
- Integrated with backend for secure API handling

## ⚙️ Additional Tools & Features

### Context API (React)
- Used for global state management
- Manages preferences across the app

### LocalStorage
- Stores user preferences
- Enables persistence across sessions

### Git & GitHub
- Version control and collaboration
- Used to manage project history and deployment

## 🧠 Core System Logic

### Scoring-Based Recommendation System
- Matches beaches with user preferences:
  - Low Crowd
  - Scenic
  - Adventure
  - Safe
- Assigns scores based on matches
- Ranks beaches dynamically

## How to Run Locally

**Step 1:**
`git clone <repo-url>`

**Step 2:**
`cd project-folder`

**Step 3:**
Install dependencies:
`npm install`

**Step 4:**
Add environment variables:
Create `.env` file and add:
```env
GEOAPIFY_API_KEY=your_key
WEATHER_API_KEY=your_key
GEMINI_API_KEY=your_key
```

**Step 5:**
Run backend:
`npm run server`

**Step 6:**
Run frontend:
`npm run dev`

**Step 7:**
Open:
`http://localhost:5173`

## Folder Structure
- /frontend
- /backend
- /components
- /pages

## Key Highlights
- Real-time beach intelligence
- Data-driven recommendations
- Clean UI/UX

## Future Improvements
- Mobile app version
- Advanced recommendation engine
- Offline dataset fallback
