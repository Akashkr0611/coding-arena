import { Request, Response } from 'express';
import { Beach, WeatherData, TideData, SafetyData, CrowdData, SuitabilityScore, User, Alert } from '../models';
import { getSuitabilityIndex, computeScore } from '../services/suitabilityService';
import NodeCache from 'node-cache';

const apiCache = new NodeCache({ stdTTL: 300 }); // Cache API responses for 5 minutes

// ---------------------------------------------------------------------------
// GET /api/beaches
// ---------------------------------------------------------------------------
export const getBeaches = async (req: Request, res: Response) => {
    try {
        const cacheKey = 'all_beaches';
        if (apiCache.has(cacheKey)) return res.json(apiCache.get(cacheKey));

        const beaches = await Beach.findAll({
            attributes: ['id', 'name', 'location', 'coordinates', 'description'],
        });

        // Parse coordinates JSON string for each beach before sending
        const parsed = beaches.map((b: any) => ({
            id: b.id,
            name: b.name,
            location: b.location,
            description: b.description,
            coordinates: parseJson(b.coordinates),
        }));

        apiCache.set(cacheKey, parsed);
        res.json(parsed);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch beaches' });
    }
};

// ---------------------------------------------------------------------------
// GET /api/beach/:id
// ---------------------------------------------------------------------------
export const getBeachById = async (req: Request, res: Response) => {
    try {
        const beach = await Beach.findByPk(Number(req.params.id), {
            include: [
                { model: WeatherData, as: 'weather',  limit: 1, order: [['timestamp', 'DESC']] },
                { model: TideData,    as: 'tides',    limit: 1, order: [['timestamp', 'DESC']] },
                { model: SafetyData,  as: 'safety'  },
                { model: CrowdData,   as: 'crowds',   limit: 1, order: [['timestamp', 'DESC']] },
                { model: SuitabilityScore, as: 'suitability_scores', limit: 10, order: [['timestamp', 'DESC']] },
            ],
        });

        if (!beach) return res.status(404).json({ error: 'Beach not found' });

        const b: any = beach.toJSON();
        b.coordinates = parseJson(b.coordinates);
        res.json(b);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch beach' });
    }
};

// ---------------------------------------------------------------------------
// GET /api/beach/:id/suitability
// ---------------------------------------------------------------------------
export const getSuitability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Sync external data (Weather + Tide APIs) and trigger alerts
        const { syncBeachData } = await import('../services/externalApiService');
        await syncBeachData(Number(id));

        const beach = await Beach.findByPk(Number(id), {
            include: [
                { model: WeatherData, as: 'weather', limit: 1, order: [['timestamp', 'DESC']] },
                { model: TideData,    as: 'tides',   limit: 1, order: [['timestamp', 'DESC']] },
                { model: SafetyData,  as: 'safety'  },
                { model: CrowdData,   as: 'crowds',  limit: 1, order: [['timestamp', 'DESC']] },
            ],
        });

        if (!beach) return res.status(404).json({ error: 'Beach not found' });

        const b: any = beach;
        const inputs = {
            weather: {
                temperature: b.weather?.[0]?.temperature ?? 25,
                uv_index:    b.weather?.[0]?.uv_index    ?? 5,
                wind_speed:  b.weather?.[0]?.wind_speed  ?? 10,
            },
            tide:   { wave_height:      b.tides?.[0]?.wave_height          ?? 1 },
            crowd:  { level:            b.crowds?.[0]?.crowd_level         ?? 'Medium' },
            // safety is a hasOne relation — NOT an array
            safety: { rip_current_risk: b.safety?.rip_current_risk         ?? 'Moderate' },
        };

        const scores = getSuitabilityIndex(inputs);

        // Persist all four activity scores
        for (const act of ['swimming', 'surfing', 'relaxing', 'family'] as const) {
            await SuitabilityScore.create({ beach_id: beach.id, activity: act, score: (scores as any)[act] });
        }

        res.json(scores);
    } catch (error: any) {
        if (error.message === 'Beach not found') {
            return res.status(404).json({ error: 'Beach not found' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to calculate suitability' });
    }
};

// ---------------------------------------------------------------------------
// GET /api/beach/:id/prediction
// ---------------------------------------------------------------------------
export const getPrediction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const beach = await Beach.findByPk(Number(id), {
            include: [
                { model: WeatherData, as: 'weather', limit: 24, order: [['timestamp', 'DESC']] },
                { model: TideData,    as: 'tides',   limit: 24, order: [['timestamp', 'DESC']] },
            ],
        });

        if (!beach) return res.status(404).json({ error: 'Beach not found' });

        const b: any = beach;
        const weatherRecords: any[] = b.weather || [];
        const tideRecords:    any[] = b.tides    || [];

        const minLen = Math.min(weatherRecords.length, tideRecords.length);
        const historicalData = [];

        for (let i = 0; i < minLen; i++) {
            historicalData.push({
                timestamp: new Date(weatherRecords[i].timestamp || Date.now()),
                weather: {
                    temperature: weatherRecords[i].temperature,
                    wind_speed:  weatherRecords[i].wind_speed,
                    uv_index:    weatherRecords[i].uv_index,
                },
                tide: { wave_height: tideRecords[i].wave_height },
            });
        }

        historicalData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        const { generatePredictions } = await import('../services/predictionService');
        const predictions = await generatePredictions(historicalData, 24);
        res.json(predictions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate predictions' });
    }
};

// ---------------------------------------------------------------------------
// GET /api/user/:id
// ---------------------------------------------------------------------------
export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(Number(req.params.id));
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ id: user.id, preferences: (user as any).preferencesJson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// ---------------------------------------------------------------------------
// POST /api/user/preferences
// ---------------------------------------------------------------------------
export const saveUserPreferences = async (req: Request, res: Response) => {
    try {
        const { user_id, preferences } = req.body;
        let user;
        if (user_id) {
            user = await User.findByPk(user_id);
            if (user) {
                user.preferences = JSON.stringify(preferences);
                await user.save();
            }
        }
        if (!user) {
            user = await User.create({ preferences: JSON.stringify(preferences) });
        }
        res.json({ message: 'Preferences saved successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save preferences' });
    }
};

// ---------------------------------------------------------------------------
// GET /api/recommendations/:user_id
// ---------------------------------------------------------------------------
export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;
        const user = await User.findByPk(Number(user_id));

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Parse preferences (stored as JSON string)
        const prefs: any = (user as any).preferencesJson ?? {};

        // Build custom weights from preferences
        let customWeights = { weather: 0.25, tide: 0.20, crowd: 0.20, safety: 0.35 };
        if (prefs.quiet)     customWeights.crowd   += 0.4;
        if (prefs.safe)      customWeights.safety  += 0.4;
        if (prefs.adventure) customWeights.tide    += 0.4;
        if (prefs.scenic)    customWeights.weather += 0.4;

        // Normalise weights to sum to 1
        const total = Object.values(customWeights).reduce((s, v) => s + v, 0);
        customWeights = {
            weather: customWeights.weather / total,
            tide:    customWeights.tide    / total,
            crowd:   customWeights.crowd   / total,
            safety:  customWeights.safety  / total,
        };

        const beaches = await Beach.findAll({
            include: [
                { model: WeatherData, as: 'weather', limit: 1, order: [['timestamp', 'DESC']] },
                { model: TideData,    as: 'tides',   limit: 1, order: [['timestamp', 'DESC']] },
                { model: SafetyData,  as: 'safety'  },
                { model: CrowdData,   as: 'crowds',  limit: 1, order: [['timestamp', 'DESC']] },
            ],
        });

        const scoredBeaches = beaches.map((beach) => {
            const b: any = beach;
            const inputs = {
                weather: {
                    temperature: b.weather?.[0]?.temperature ?? 25,
                    uv_index:    b.weather?.[0]?.uv_index    ?? 5,
                    wind_speed:  b.weather?.[0]?.wind_speed  ?? 10,
                },
                tide:   { wave_height:      b.tides?.[0]?.wave_height   ?? 1 },
                crowd:  { level:            b.crowds?.[0]?.crowd_level  ?? 'Medium' },
                safety: { rip_current_risk: b.safety?.rip_current_risk  ?? 'Moderate' },
            };

            return {
                beach: { id: beach.id, name: beach.name, location: beach.location, description: beach.description },
                personalized_score: computeScore(inputs, 'overall', customWeights),
            };
        });

        scoredBeaches.sort((a, b) => b.personalized_score - a.personalized_score);
        res.json(scoredBeaches.slice(0, 5));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
};

// ---------------------------------------------------------------------------
// GET /api/seed  — seeds beaches + sample data on first run
// ---------------------------------------------------------------------------
import { beachesData } from '../seedData';

export const seedBeaches = async (req: Request, res: Response) => {
    try {
        const count = await Beach.count();
        if (count >= 25) return res.json({ message: 'Beaches already seeded' });

        await Beach.destroy({ where: {}, truncate: true });
        
        for (const b of beachesData) {
            const beach = await Beach.create({
                name: b.name,
                location: `${b.state}, India`,
                coordinates: JSON.stringify({ type: 'Point', coordinates: [b.lon, b.lat] }),
                description: `A beautiful beach located in ${b.state}.`,
            });
            // Seed initial data
            await WeatherData.create({ beach_id: beach.id, temperature: 25 + Math.random() * 10, wind_speed: 10 + Math.random() * 10, uv_index: 5 + Math.random() * 5 });
            await TideData.create(   { beach_id: beach.id, tide_level: 0.5 + Math.random(), wave_height: 1.0 + Math.random() });
            await SafetyData.create( { beach_id: beach.id, rip_current_risk: Math.random() > 0.8 ? 'High' : 'Moderate', lifeguard_available: true });
            await CrowdData.create(  { beach_id: beach.id, crowd_level: 'Medium' });
        }

        const b1 = await Beach.findOne();
        if (b1) {
            // Trigger alerts for the first beach as an example
            const { checkAndTriggerAlerts } = await import('../services/alertService');
            await checkAndTriggerAlerts(b1.id, {
                weather: { temperature: 30, wind_speed: 15, uv_index: 9 },
                tide:    { wave_height: 2.6 },
                safety:  { rip_current_risk: 'High' },
                crowd:   { level: 'High' },
            });
        }
        
        const userCount = await User.count();
        if (userCount === 0) {
            await User.create({ preferences: JSON.stringify({ safe: true, scenic: true }) });
        }

        res.json({ message: 'Beaches and sample data seeded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to seed beaches' });
    }
};
// ---------------------------------------------------------------------------
// GET /api/alerts/:beach_id
// ---------------------------------------------------------------------------
export const getAlerts = async (req: Request, res: Response) => {
    try {
        const alerts = await Alert.findAll({
            where: { beach_id: Number(req.params.beach_id) },
            order: [['timestamp', 'DESC']],
            limit: 10,
        });
        res.json(alerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseJson(raw: any): any {
    if (!raw) return null;
    try { return typeof raw === 'string' ? JSON.parse(raw) : raw; }
    catch { return null; }
}
