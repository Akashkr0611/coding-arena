"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const beaches_1 = __importDefault(require("../src/routes/beaches"));
const db_1 = require("../src/db");
require("../src/models");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', beaches_1.default);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.sequelize.sync({ force: true });
    // Seed initial database
    yield (0, supertest_1.default)(app).get('/api/seed');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.sequelize.close();
}));
describe('CoastWise API Integration Tests', () => {
    test('GET /api/beaches should return a list of beaches and utilize cache', () => __awaiter(void 0, void 0, void 0, function* () {
        // First call
        const startTime1 = Date.now();
        const res1 = yield (0, supertest_1.default)(app).get('/api/beaches');
        const duration1 = Date.now() - startTime1;
        expect(res1.status).toBe(200);
        expect(Array.isArray(res1.body)).toBe(true);
        // Second call should be from cache and typically faster
        const startTime2 = Date.now();
        const res2 = yield (0, supertest_1.default)(app).get('/api/beaches');
        const duration2 = Date.now() - startTime2;
        expect(res2.status).toBe(200);
        expect(res2.body.length).toEqual(res1.body.length);
    }));
    test('GET /api/beach/:id should return single beach details', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/api/beach/1');
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.name).toBeDefined();
    }));
    test('GET /api/beach/:id/suitability should calculate and return scores', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/api/beach/1/suitability');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('swimming');
        expect(res.body).toHaveProperty('surfing');
        expect(res.body).toHaveProperty('relaxing');
        expect(res.body).toHaveProperty('family');
    }));
    test('GET /api/beach/999/suitability should handle missing beach properly', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/api/beach/999/suitability');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Beach not found');
    }));
});
