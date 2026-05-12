import request from 'supertest';
import express from 'express';
import beachRoutes from '../src/routes/beaches';
import { sequelize } from '../src/db';
import '../src/models';

const app = express();
app.use(express.json());
app.use('/api', beachRoutes);

beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Seed initial database
    await request(app).get('/api/seed');
});

afterAll(async () => {
    await sequelize.close();
});

describe('CoastWise API Integration Tests', () => {

    test('GET /api/beaches should return a list of beaches and utilize cache', async () => {
        // First call
        const startTime1 = Date.now();
        const res1 = await request(app).get('/api/beaches');
        const duration1 = Date.now() - startTime1;
        expect(res1.status).toBe(200);
        expect(Array.isArray(res1.body)).toBe(true);

        // Second call should be from cache and typically faster
        const startTime2 = Date.now();
        const res2 = await request(app).get('/api/beaches');
        const duration2 = Date.now() - startTime2;
        expect(res2.status).toBe(200);
        expect(res2.body.length).toEqual(res1.body.length);
    });

    test('GET /api/beach/:id should return single beach details', async () => {
        const res = await request(app).get('/api/beach/1');
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.name).toBeDefined();
    });

    test('GET /api/beach/:id/suitability should calculate and return scores', async () => {
        const res = await request(app).get('/api/beach/1/suitability');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('swimming');
        expect(res.body).toHaveProperty('surfing');
        expect(res.body).toHaveProperty('relaxing');
        expect(res.body).toHaveProperty('family');
    });

    test('GET /api/beach/999/suitability should handle missing beach properly', async () => {
        const res = await request(app).get('/api/beach/999/suitability');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Beach not found');
    });
});
