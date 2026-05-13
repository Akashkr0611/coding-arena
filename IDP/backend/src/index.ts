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
const PORT = process.env.PORT || 3000;

// ─── CORS ────────────────────────────────────────────────────────────────────
// In production the frontend is served from the SAME origin, so CORS is only
// needed when running the Vite dev server (localhost:5173) separately.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o)) || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive during development; tighten for prod
    }
  },
  credentials: true,
}));

app.use(express.json());

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api', beachRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'CoastWise API is running.' });
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
    console.log('✅ Database connected successfully.');

    await sequelize.sync({ force: false });
    console.log('✅ Models synced.');

    app.listen(PORT, () => {
      console.log(`🚀 CoastWise server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

