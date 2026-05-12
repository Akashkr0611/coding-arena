export interface SuitabilityInputs {
    weather: {
        temperature: number; // Celsius
        uv_index: number; // 0-11+
        wind_speed: number; // km/h
    };
    tide: {
        wave_height: number; // meters
    };
    crowd: {
        level: 'Low' | 'Medium' | 'High';
    };
    safety: {
        rip_current_risk: 'Low' | 'Moderate' | 'High';
    };
}

export interface ActivityWeights {
    weather: number;
    tide: number;
    crowd: number;
    safety: number;
}

const DEFAULT_WEIGHTS: ActivityWeights = {
    weather: 0.25,
    tide: 0.20,
    crowd: 0.20,
    safety: 0.35
};

// Helper: normalize categorical to 0-1
const parseLevel = (level: string, isInverse: boolean = false): number => {
    const l = level.toLowerCase();
    let score = 0;
    if (l === 'low') score = 1.0;
    else if (l === 'medium' || l === 'moderate') score = 0.5;
    else if (l === 'high') score = 0.0;
    
    return isInverse ? 1 - score : score;
};

// Helper: Normalize numeric to 0-1 based on a range [min, max]
const normalize = (val: number, min: number, max: number, higherIsBetter: boolean): number => {
    // Guard against NaN — treat as worst-case
    if (isNaN(val)) return 0;
    let bounded = Math.max(min, Math.min(max, val));
    let ratio = (bounded - min) / (max - min);
    return higherIsBetter ? ratio : 1 - ratio;
};

export const computeScore = (inputs: SuitabilityInputs, activity: string, customWeights?: Partial<ActivityWeights>): number => {
    const weights = { ...DEFAULT_WEIGHTS, ...customWeights };
    let weatherScore = 0;
    let tideScore = 0;
    let crowdScore = parseLevel(inputs.crowd.level); // default Low = 1 (good)
    let safetyScore = parseLevel(inputs.safety.rip_current_risk); // default Low = 1 (good)

    const t = inputs.weather.temperature;
    const uv = inputs.weather.uv_index;
    const w = inputs.weather.wind_speed;
    const wh = inputs.tide.wave_height;

    // Normalization logic based on activity
    if (activity === 'swimming') {
        // Swimming: low waves, low risk
        weatherScore = (normalize(t, 15, 35, true) * 0.6) + (normalize(uv, 0, 10, false) * 0.2) + (normalize(w, 0, 30, false) * 0.2);
        tideScore = normalize(wh, 0, 2, false); // < 2m is better
        safetyScore = parseLevel(inputs.safety.rip_current_risk); // Low = 1
        crowdScore = parseLevel(inputs.crowd.level);
    } 
    else if (activity === 'surfing') {
        // Surfing: high waves, moderate risk acceptable
        weatherScore = (normalize(w, 5, 25, true) * 0.8) + (normalize(t, 10, 35, true) * 0.2);
        tideScore = normalize(wh, 1, 4, true); // Higher waves (up to 4m) is better
        // Moderate risk might be 1, high is 0.5, low is 0.2 (no waves)
        const risk = inputs.safety.rip_current_risk.toLowerCase();
        safetyScore = risk === 'moderate' ? 1.0 : (risk === 'high' ? 0.4 : 0.8);
        crowdScore = parseLevel(inputs.crowd.level); // Less crowd is still better to avoid collisions
    }
    else if (activity === 'relaxing') {
        // Relaxing: good weather (not too hot/windy), low crowd
        weatherScore = (normalize(t, 20, 32, false) * 0.5) + (normalize(uv, 0, 8, false) * 0.3) + (normalize(w, 0, 15, false) * 0.2);
        tideScore = 1.0; // Waves don't matter much for relaxing
        crowdScore = parseLevel(inputs.crowd.level); // Less crowd is heavily desired
        safetyScore = 1.0; // Rip current doesn't matter if not in water
    }
    else if (activity === 'family') {
        // Family: extremely low risk, low waves, good weather, low UV
        weatherScore = (normalize(t, 20, 30, false) * 0.4) + (normalize(uv, 0, 6, false) * 0.4) + (normalize(w, 0, 15, false) * 0.2);
        tideScore = normalize(wh, 0, 1, false); // No waves is best
        safetyScore = inputs.safety.rip_current_risk.toLowerCase() === 'low' ? 1.0 : 0.0; // Must be low risk
        crowdScore = parseLevel(inputs.crowd.level); // Less crowd is better
    }
    else if (activity === 'overall') {
        // Overall: generalized score adapted dynamically via weights passed in.
        // Good weather
        weatherScore = (normalize(t, 20, 32, false) * 0.5) + (normalize(uv, 0, 8, false) * 0.3) + (normalize(w, 0, 20, false) * 0.2);
        // Tide score: default assumes lower waves is generally safer/better unless 'adventure' weight is very high, 
        // we'll just map it moderately.
        tideScore = normalize(wh, 0, 3, false); 
        // Crowd and Safety rely on direct parse
        crowdScore = parseLevel(inputs.crowd.level); 
        safetyScore = parseLevel(inputs.safety.rip_current_risk); 
    }

    // Weighted Sum
    const finalScore = (
        (weatherScore * weights.weather) +
        (tideScore * weights.tide) +
        (crowdScore * weights.crowd) +
        (safetyScore * weights.safety)
    );

    // Convert to 0-100 scale
    return Math.max(0, Math.min(100, Math.round(finalScore * 100)));
};

export const getSuitabilityIndex = (inputs: SuitabilityInputs, weights?: Partial<ActivityWeights>) => {
    return {
        swimming: computeScore(inputs, 'swimming', weights),
        surfing: computeScore(inputs, 'surfing', weights),
        relaxing: computeScore(inputs, 'relaxing', weights),
        family: computeScore(inputs, 'family', weights)
    };
};
