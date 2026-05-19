import { Router } from 'express';
import { getBeaches, getBeachById, getSuitability, getPrediction, seedBeaches, saveUserPreferences, getRecommendations, getAlerts, getUser } from '../controllers/beachController';
import { getLiveData, chat, getWeather, getWeatherDetails, geocode, getRoute } from '../controllers/extraController';

const router = Router();

// Routes
router.get('/seed', seedBeaches); // Route to seed database initially
router.get('/beaches', getBeaches);
router.get('/weather', getWeather);
router.get('/weather/details', getWeatherDetails);
router.get('/geocode', geocode);
router.post('/route', getRoute);
router.get('/alerts/:beach_id', getAlerts);
router.get('/beach/:id', getBeachById);
router.get('/beach/:id/live-data', getLiveData);
router.get('/beach/:id/suitability', getSuitability);
router.get('/beach/:id/prediction', getPrediction);
router.get('/recommendations/:user_id', getRecommendations);
router.get('/user/:id', getUser);
router.post('/user/preferences', saveUserPreferences);
router.post('/chat', chat);

export default router;
