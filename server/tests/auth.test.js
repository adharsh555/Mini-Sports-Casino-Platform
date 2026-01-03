const request = require('supertest');
const app = require('../index');
const sequelize = require('../config/db');
const { User } = require('../models');

describe('Auth API', () => {
    beforeAll(async () => {
        // Use a test environment or ensure DB is synced
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toEqual('test@example.com');
    });

    it('should not register an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('User already exists');
    });
});
