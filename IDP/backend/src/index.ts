import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root. Works when run from any CWD:
//   dev:  backend/  → __dirname = backend/src/ → ../../.env = root/.env
//   prod: root/     → __dirname = backend/dist/ → ../../.env = root/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to CWD/.env if root not found

import beachRoutes from './routes/beaches';
import { sequelize } from './db';
import './models'; // Import models to register them with Sequelize

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api', beachRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'CoastWise API is running.' });
});

const FOURSQUARE_API_KEY = "3WKLNWFM324BDAS4LRD2RNY5BBUJX0MNL3ZSBFAHBHQ3OTAE";

app.get('/api/nearby', async (req, res) => {
  const { lat, lon, type } = req.query;
  const category = type === "hotel" ? "13000" : "15000";

  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&radius=50000&limit=10&categories=${category}`,
      {
        headers: {
          Authorization: FOURSQUARE_API_KEY,
          Accept: "application/json"
        }
      }
    );

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.json([]);
    }

    const places = data.results
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, 3)
      .map((place: any) => ({
        name: place.name,
        distance: place.distance
      }));

    res.json(places);
  } catch (error) {
    console.error("Backend API error:", error);
    res.status(500).json([]);
  }
});

// ─── SERVE REACT FRONTEND (production) ───────────────────────────────────────
// __dirname in the compiled JS will be  backend/dist/
// The Vite build output is at             frontend/dist/
const frontendDist = path.join(__dirname, '../../frontend/dist');

app.use(express.static(frontendDist));

// SPA catch-all — Express 5 requires named wildcards, not bare *
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ force: false });

    app.listen(PORT as number, "0.0.0.0", () => {
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

