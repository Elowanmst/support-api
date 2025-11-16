const mongoose = require('mongoose');
const RequestType = require('../src/models/RequestType');

describe('RequestType Model', () => {
  beforeAll(async () => {
    const MONGODB_URI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/test_support_api';
    await mongoose.connect(MONGODB_URI);
  });

  beforeEach(async () => {
    await RequestType.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should create a valid request type', async () => {
    const requestTypeData = {
      code: 'TEST_MODEL',
      name: 'Test Model',
      description: 'Test model description',
      category: 'Testing',
      estimatedResponseTime: 12,
    };

    const requestType = new RequestType(requestTypeData);
    const savedRequestType = await requestType.save();

    expect(savedRequestType.code).toBe('TEST_MODEL');
    expect(savedRequestType.name).toBe('Test Model');
    expect(savedRequestType.priority).toBe('medium'); // valeur par défaut
    expect(savedRequestType.isActive).toBe(true); // valeur par défaut
    expect(savedRequestType._id).toBeDefined();
    expect(savedRequestType.createdAt).toBeDefined();
    expect(savedRequestType.updatedAt).toBeDefined();
  });

  test('should fail without required fields', async () => {
    const requestType = new RequestType({
      name: 'Missing Required Fields',
      // Manque code, description, category, estimatedResponseTime
    });

    let error;
    try {
      await requestType.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.code).toBeDefined();
    expect(error.errors.description).toBeDefined();
    expect(error.errors.category).toBeDefined();
    expect(error.errors.estimatedResponseTime).toBeDefined();
  });

  test('should validate priority enum', async () => {
    const requestType = new RequestType({
      code: 'INVALID_PRIORITY',
      name: 'Invalid Priority',
      description: 'Test invalid priority',
      category: 'Test',
      estimatedResponseTime: 24,
      priority: 'invalid_priority',
    });

    let error;
    try {
      await requestType.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.priority).toBeDefined();
  });

  test('should use findActive static method', async () => {
    await RequestType.create([
      {
        code: 'ACTIVE_1',
        name: 'Active 1',
        description: 'Active type 1',
        category: 'Test',
        estimatedResponseTime: 24,
        isActive: true,
      },
      {
        code: 'ACTIVE_2',
        name: 'Active 2',
        description: 'Active type 2',
        category: 'Test',
        estimatedResponseTime: 24,
        isActive: true,
      },
      {
        code: 'INACTIVE_1',
        name: 'Inactive 1',
        description: 'Inactive type 1',
        category: 'Test',
        estimatedResponseTime: 24,
        isActive: false,
      },
    ]);

    const activeTypes = await RequestType.findActive();
    expect(activeTypes).toHaveLength(2);
    expect(activeTypes.every((type) => type.isActive)).toBe(true);
  });
});
