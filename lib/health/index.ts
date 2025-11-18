/**
 * Health Check Service
 * 
 * This module provides health check functionality for monitoring
 * critical application services (database and external APIs).
 */

export {
  checkMySQLHealth,
  checkQuranAPIHealth,
  runAllHealthChecks,
} from './health-service';

export type {
  HealthStatus,
  ServiceHealth,
  HealthCheckResponse,
} from './types';

