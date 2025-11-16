// Configuration globale pour Jest
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test_support_api';

// Timeout global pour les tests
jest.setTimeout(30000);

// Mock des console.log en mode test
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}
