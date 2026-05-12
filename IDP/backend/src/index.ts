import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import beachRoutes from './routes/beaches';
import { sequelize } from './db';
import './models'; // Import models to register them with Sequelize

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost for dev, any vercel.app domain for production, and same-origin
    const allowed = !origin || 
      origin.includes('localhost') || 
      origin.includes('vercel.app') ||
      origin === process.env.FRONTEND_URL;
    callback(null, allowed);
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', beachRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'CoastWise API is running.' });
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models
        await sequelize.sync({ force: false });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
