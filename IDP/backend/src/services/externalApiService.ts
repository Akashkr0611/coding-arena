import axios from 'axios';
import NodeCache from 'node-cache';
import { Beach, WeatherData, TideData, SafetyData, CrowdData } from '../models';
import { checkAndTriggerAlerts } from './alertService';
import { SuitabilityInputs } from './suitabilityService';

// Cache to prevent rate limits: cache data for 30 minutes
const cache = new NodeCache({ stdTTL: 1800 });
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'dummy_key';

/** Parse coordinates from either a GeoJSON object or a JSON string. */
const parseCoordinates = (raw: any): [number, number] => {
    if (!raw) return [0, 0];
    try {
        const geo = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return geo.coordinates as [number, number]; // [longitude, latitude]
    } catch {
        return [0, 0];
    }
};

export const syncBeachData = async (beachId: number): Promise<SuitabilityInputs> => {
    const cacheKey = `beach_sync_${beachId}`;

    // Rate-limit / caching layer
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey) as SuitabilityInputs;
    }

    const beach = await Beach.findByPk(beachId);
    if (!beach) throw new Error('Beach not found');

    const [lon, lat] = parseCoordinates((beach as any).coordinates);

    let temp = 28, wind = 12, uv = 6;
    let waveHeight = 1.0, tideLevel = 0.5;

    // 1. Fetch real-time weather data (OpenWeather)
    try {
        if (OPENWEATHER_API_KEY !== 'dummy_key') {
            const weatherRes = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
            );
            temp = weatherRes.data.main.temp;
            wind = weatherRes.data.wind.speed * 3.6; // m/s → km/h
            uv = Math.floor(Math.random() * 10);     // UV not in free endpoint
        } else {
            temp = 25 + Math.random() * 10;
            wind = 5 + Math.random() * 15;
            uv = Math.floor(Math.random() * 11);
        }
    } catch (error: any) {
        console.error('Weather API Error:', error.message, '— falling back to safe defaults.');
    }

    // 2. Fetch real-time tide data (mocked / placeholder for WorldTides / StormGlass)
    try {
        waveHeight = 0.5 + Math.random() * 2.5;
        tideLevel  = waveHeight * 0.4;
    } catch (error: any) {
        console.error('Tide API Error:', error.message);
    }

    // 3. Persist in DB (time-series append)
    await WeatherData.create({ beach_id: beachId, temperature: temp, wind_speed: wind, uv_index: uv });
    await TideData.create({ beach_id: beachId, tide_level: tideLevel, wave_height: waveHeight });

    const ripCurrentRisk = waveHeight > 2.0 ? 'High' : 'Moderate';
    await SafetyData.create({ beach_id: beachId, rip_current_risk: ripCurrentRisk, lifeguard_available: true });
    await CrowdData.create({ beach_id: beachId, crowd_level: 'Medium' });

    const inputs: SuitabilityInputs = {
        weather: { temperature: temp, wind_speed: wind, uv_index: uv },
        tide:    { wave_height: waveHeight },
        safety:  { rip_current_risk: ripCurrentRisk as 'Low' | 'Moderate' | 'High' },
        crowd:   { level: 'Medium' },
    };

    // 4. Trigger safety alert engine
    await checkAndTriggerAlerts(beachId, inputs);

    cache.set(cacheKey, inputs);
    return inputs;
};
