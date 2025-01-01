import request from 'supertest';
import { app } from '../src/server';

describe('GET /api/shorten/:alias', () => {
    it('should return 200 if alias exists', async () => {
        const res = await request(app).get('/api/shorten/test');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Short URL found');
    });

    it('should return 404 if alias does not exist', async () => {
        const res = await request(app).get('/api/shorten/nonexistent');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Short URL not found');
    });
});
