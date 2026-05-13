"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suitabilityService_1 = require("../src/services/suitabilityService");
// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------
const perfectInputs = {
    weather: { temperature: 25, wind_speed: 5, uv_index: 3 },
    tide: { wave_height: 0.5 },
    safety: { rip_current_risk: 'Low' },
    crowd: { level: 'Low' },
};
const dangerousInputs = {
    weather: { temperature: 35, wind_speed: 30, uv_index: 10 },
    tide: { wave_height: 3.5 },
    safety: { rip_current_risk: 'High' },
    crowd: { level: 'High' },
};
const missingDataInputs = {
    weather: { temperature: NaN, wind_speed: NaN, uv_index: NaN },
    tide: { wave_height: NaN },
    // Edge cases: empty strings fall through to the default 0 branch in parseLevel
    safety: { rip_current_risk: '' },
    crowd: { level: '' },
};
// ---------------------------------------------------------------------------
// getSuitabilityIndex — returns { swimming, surfing, relaxing, family }
// ---------------------------------------------------------------------------
describe('getSuitabilityIndex', () => {
    test('returns an object with all four activity scores', () => {
        const scores = (0, suitabilityService_1.getSuitabilityIndex)(perfectInputs);
        expect(scores).toHaveProperty('swimming');
        expect(scores).toHaveProperty('surfing');
        expect(scores).toHaveProperty('relaxing');
        expect(scores).toHaveProperty('family');
    });
    test('all scores are in the 0-100 range', () => {
        const scores = (0, suitabilityService_1.getSuitabilityIndex)(perfectInputs);
        for (const v of Object.values(scores)) {
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThanOrEqual(100);
        }
    });
});
// ---------------------------------------------------------------------------
// computeScore — per-activity scores
// ---------------------------------------------------------------------------
describe('Suitability Algorithm', () => {
    test('family score is high under perfect conditions', () => {
        const score = (0, suitabilityService_1.computeScore)(perfectInputs, 'family');
        expect(score).toBeGreaterThan(75); // algorithm returns ~78
    });
    test('swimming score is low when rip current risk is High', () => {
        const score = (0, suitabilityService_1.computeScore)(dangerousInputs, 'swimming');
        expect(score).toBeLessThan(40);
    });
    test('surfing score improves with higher waves', () => {
        const goodSurfInputs = Object.assign(Object.assign({}, perfectInputs), { tide: { wave_height: 2.0 } });
        const baseScore = (0, suitabilityService_1.computeScore)(perfectInputs, 'surfing');
        const surfScore = (0, suitabilityService_1.computeScore)(goodSurfInputs, 'surfing');
        expect(surfScore).toBeGreaterThan(baseScore);
        expect(surfScore).toBeGreaterThan(55); // algorithm returns ~58
    });
    test('relaxing score is lower in crowded conditions', () => {
        const crowdedInputs = Object.assign(Object.assign({}, perfectInputs), { crowd: { level: 'High' } });
        const quietScore = (0, suitabilityService_1.computeScore)(perfectInputs, 'relaxing');
        const crowdedScore = (0, suitabilityService_1.computeScore)(crowdedInputs, 'relaxing');
        expect(quietScore).toBeGreaterThan(crowdedScore);
    });
    test('scores remain in 0-100 range for NaN / missing data', () => {
        const score = (0, suitabilityService_1.computeScore)(missingDataInputs, 'swimming');
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
    });
    test('custom weights are applied correctly', () => {
        // Heavy safety weight — dangerous inputs should score very low
        const safetyFirst = { weather: 0.1, tide: 0.1, crowd: 0.1, safety: 0.7 };
        const safeScore = (0, suitabilityService_1.computeScore)(dangerousInputs, 'overall', safetyFirst);
        expect(safeScore).toBeLessThan(30);
    });
});
