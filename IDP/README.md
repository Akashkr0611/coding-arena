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

## Tech Stack
**Frontend:**
- React.js (TypeScript)
- Vite
- Leaflet / React-Leaflet
- Lucide Icons

**Backend:**
- Node.js
- Express.js
- Sequelize (SQLite)

**APIs Used:**
- OpenWeather API
- Stormglass API
- Geoapify Places API
- Gemini AI API

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
