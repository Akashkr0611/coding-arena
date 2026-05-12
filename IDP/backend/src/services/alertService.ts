import { Alert, Beach } from '../models';
import { SuitabilityInputs } from './suitabilityService';

export const checkAndTriggerAlerts = async (beachId: number, inputs: SuitabilityInputs) => {
    const alertsToTrigger = [];

    // Check thresholds
    if (inputs.tide.wave_height > 2.5) {
        alertsToTrigger.push({
            beach_id: beachId,
            type: 'danger',
            message: `High wave height detected (${inputs.tide.wave_height.toFixed(1)}m). Avoid entering the water.`
        });
    } else if (inputs.tide.wave_height > 1.5) {
        alertsToTrigger.push({
            beach_id: beachId,
            type: 'warning',
            message: `Moderate wave height detected (${inputs.tide.wave_height.toFixed(1)}m). Swim with caution.`
        });
    }

    if (inputs.weather.uv_index > 8) {
        alertsToTrigger.push({
            beach_id: beachId,
            type: 'warning',
            message: `High UV Index (${inputs.weather.uv_index}). Apply sunscreen and seek shade.`
        });
    }

    if (inputs.safety.rip_current_risk.toLowerCase() === 'high') {
        alertsToTrigger.push({
            beach_id: beachId,
            type: 'danger',
            message: 'High rip current risk detected. Swimming is strictly prohibited today.'
        });
    }

    // Save alerts to DB
    const createdAlerts = [];
    for (const alertData of alertsToTrigger) {
        // Here we could check if an identical alert was recently created to avoid spam, 
        // but for now we just create it.
        const newAlert = await Alert.create(alertData);
        createdAlerts.push(newAlert);
    }

    return createdAlerts;
};
