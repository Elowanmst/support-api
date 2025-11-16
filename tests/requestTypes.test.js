const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const RequestType = require('../src/models/RequestType');

describe('Support API Tests', () => {
  beforeAll(async () => {
    // Connexion à la base de test
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_support_api';
    await mongoose.connect(MONGODB_URI);
  });

  beforeEach(async () => {
    // Nettoyer la collection avant chaque test
    await RequestType.deleteMany({});
  });

  afterAll(async () => {
    // Fermer la connexion après tous les tests
    await mongoose.connection.close();
  });

  describe('GET /health', () => {
    test('should return status 200', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('GET /api/request-types', () => {
    test('should return an array', async () => {
      const response = await request(app)
        .get('/api/request-types')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should return empty array when no data', async () => {
      const response = await request(app)
        .get('/api/request-types')
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return active request types only', async () => {
      // Créer des données de test
      await RequestType.create([
        {
          code: 'ACTIVE_TYPE',
          name: 'Active Type',
          description: 'This is active',
          category: 'Test',
          estimatedResponseTime: 24,
          isActive: true
        },
        {
          code: 'INACTIVE_TYPE',
          name: 'Inactive Type',
          description: 'This is inactive',
          category: 'Test',
          estimatedResponseTime: 24,
          isActive: false
        }
      ]);

      const response = await request(app)
        .get('/api/request-types')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].code).toBe('ACTIVE_TYPE');
    });
  });

  describe('POST /api/request-types', () => {
    test('should create successfully', async () => {
      const newRequestType = {
        code: 'NEW_TYPE',
        name: 'New Type',
        description: 'This is a new type',
        category: 'Test',
        estimatedResponseTime: 48,
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/request-types')
        .send(newRequestType)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('code', 'NEW_TYPE');
      expect(response.body.data).toHaveProperty('name', 'New Type');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('createdAt');
    });

    test('should fail with missing required fields', async () => {
      const invalidRequestType = {
        name: 'Missing Code'
        // Manque code, description, category, estimatedResponseTime
      };

      const response = await request(app)
        .post('/api/request-types')
        .send(invalidRequestType)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    test('should fail with duplicate code', async () => {
      // Créer un premier type
      await RequestType.create({
        code: 'DUPLICATE_TEST',
        name: 'Original Type',
        description: 'Original description',
        category: 'Test',
        estimatedResponseTime: 24
      });

      // Essayer de créer un type avec le même code
      const duplicateType = {
        code: 'DUPLICATE_TEST',
        name: 'Duplicate Type',
        description: 'Duplicate description',
        category: 'Test',
        estimatedResponseTime: 24
      };

      const response = await request(app)
        .post('/api/request-types')
        .send(duplicateType)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('code existe déjà');
    });
  });

  describe('GET /api/request-types/:id', () => {
    test('should return specific request type', async () => {
      const requestType = await RequestType.create({
        code: 'SPECIFIC_TYPE',
        name: 'Specific Type',
        description: 'Specific description',
        category: 'Test',
        estimatedResponseTime: 24
      });

      const response = await request(app)
        .get(`/api/request-types/${requestType._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.code).toBe('SPECIFIC_TYPE');
    });

    test('should return 404 for non-existent id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/request-types/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('non trouvé');
    });
  });
});
