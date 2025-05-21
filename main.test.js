const request = require('supertest');
const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});
app.get('/', (req, res) => res.send('Hello World!'));

describe('GET /', () => {
    it('should return Hello World', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Hello World!');
    });
});