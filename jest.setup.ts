// Jest setup file
// This file runs before each test file

// Load environment variables from .env.test
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.test file
config({ path: resolve(__dirname, '.env.test') });

// Increase timeout for integration tests that make real HTTP requests and DB queries
jest.setTimeout(30000); // 30 seconds
