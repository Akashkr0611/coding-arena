import { SuitabilityInputs, getSuitabilityIndex } from './suitabilityService';

export interface HistoricalDataPoint {
    timestamp: Date;
    weather: { temperature: number; wind_speed: number; uv_index: number };
    tide: { wave_height: number };
}

// Base ML Model Interface (Prepared for future LSTM upgrade)
export interface TimeSeriesPredictor {
    train(historicalData: HistoricalDataPoint[]): Promise<void>;
    predict(hoursAhead: number): Promise<SuitabilityInputs[]>;
}

// Simple Linear Regression Model (Placeholder for LSTM)
export class SimpleRegressionModel implements TimeSeriesPredictor {
    private slopeTemp: number = 0;
    private interceptTemp: number = 0;
    
    private slopeWind: number = 0;
    private interceptWind: number = 0;

    private slopeWave: number = 0;
    private interceptWave: number = 0;

    private lastKnownData: HistoricalDataPoint | null = null;

    async train(historicalData: HistoricalDataPoint[]): Promise<void> {
        if (historicalData.length === 0) return;
        this.lastKnownData = historicalData[historicalData.length - 1];

        // Simplistic regression implementation: y = mx + b
        // For demonstration, we just calculate a basic trend line over the last few data points.
        const n = historicalData.length;
        if (n < 2) {
            this.interceptTemp = historicalData[0].weather.temperature;
            this.interceptWind = historicalData[0].weather.wind_speed;
            this.interceptWave = historicalData[0].tide.wave_height;
            return;
        }

        let sumX = 0, sumYTemp = 0, sumYWind = 0, sumYWave = 0;
        let sumXYTemp = 0, sumXYWind = 0, sumXYWave = 0;
        let sumX2 = 0;

        const startTime = historicalData[0].timestamp.getTime();

        historicalData.forEach(point => {
            // x is hours since start
            const x = (point.timestamp.getTime() - startTime) / (1000 * 60 * 60);
            sumX += x;
            sumX2 += x * x;

            sumYTemp += point.weather.temperature;
            sumXYTemp += x * point.weather.temperature;

            sumYWind += point.weather.wind_speed;
            sumXYWind += x * point.weather.wind_speed;

            sumYWave += point.tide.wave_height;
            sumXYWave += x * point.tide.wave_height;
        });

        const denom = (n * sumX2 - sumX * sumX) || 1; // prevent divide by zero

        this.slopeTemp = (n * sumXYTemp - sumX * sumYTemp) / denom;
        this.interceptTemp = (sumYTemp - this.slopeTemp * sumX) / n;

        this.slopeWind = (n * sumXYWind - sumX * sumYWind) / denom;
        this.interceptWind = (sumYWind - this.slopeWind * sumX) / n;

        this.slopeWave = (n * sumXYWave - sumX * sumYWave) / denom;
        this.interceptWave = (sumYWave - this.slopeWave * sumX) / n;
    }

    async predict(hoursAhead: number): Promise<SuitabilityInputs[]> {
        const predictions: SuitabilityInputs[] = [];
        
        // If we don't have training data, return sensible defaults
        const baseTemp = this.lastKnownData ? this.lastKnownData.weather.temperature : 25;
        const baseWind = this.lastKnownData ? this.lastKnownData.weather.wind_speed : 10;
        const baseWave = this.lastKnownData ? this.lastKnownData.tide.wave_height : 1.0;
        const baseUv = this.lastKnownData ? this.lastKnownData.weather.uv_index : 5; // Unlikely to linearly predict UV simply, keep constant or sinusoidal (mocked here)

        for (let i = 1; i <= hoursAhead; i++) {
            // Apply a slight dampening to slope to avoid crazy predictions over 72 hours
            const predictedTemp = Math.max(10, Math.min(45, baseTemp + (this.slopeTemp * i * 0.1)));
            const predictedWind = Math.max(0, Math.min(50, baseWind + (this.slopeWind * i * 0.1)));
            const predictedWave = Math.max(0, Math.min(5, baseWave + (this.slopeWave * i * 0.05)));
            
            // UV index roughly follows a daily cycle (mocking a sine wave based on hour of day)
            // Just assuming +i hours from now. We'll use a mocked UV.
            const currentHour = (new Date().getHours() + i) % 24;
            const predictedUv = currentHour >= 8 && currentHour <= 18 ? 
                Math.max(0, 10 - Math.abs(13 - currentHour) * 2) : 0;

            predictions.push({
                weather: {
                    temperature: predictedTemp,
                    wind_speed: predictedWind,
                    uv_index: predictedUv
                },
                tide: {
                    wave_height: predictedWave
                },
                // Assuming safety and crowd stay roughly similar or change heuristically 
                // (LSTM could predict these as well)
                crowd: {
                    level: currentHour >= 10 && currentHour <= 16 ? 'High' : 'Low'
                },
                safety: {
                    rip_current_risk: predictedWave > 2.5 ? 'High' : (predictedWave > 1.5 ? 'Moderate' : 'Low')
                }
            });
        }

        return predictions;
    }
}

// Prediction Orchestrator
export const generatePredictions = async (
    historicalData: HistoricalDataPoint[], 
    hoursAhead: number = 24
) => {
    // Inject the model here. Later, this can be swapped with new LSTMPredictor()
    const model: TimeSeriesPredictor = new SimpleRegressionModel();
    
    await model.train(historicalData);
    const predictedInputs = await model.predict(hoursAhead);

    // Calculate final scores using predicted inputs
    return predictedInputs.map((inputs, index) => {
        const scores = getSuitabilityIndex(inputs);
        const time = new Date(Date.now() + (index + 1) * 60 * 60 * 1000);
        
        return {
            time: time.toISOString(),
            swimming: scores.swimming / 100, // Converting to 0-1 scale as per request format
            surfing: scores.surfing / 100,
            relaxing: scores.relaxing / 100,
            family: scores.family / 100,
        };
    });
};
