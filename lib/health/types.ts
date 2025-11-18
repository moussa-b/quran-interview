/**
 * Health check status types
 */
export type HealthStatus = 'healthy' | 'unhealthy';

/**
 * Individual service health check result
 */
export interface ServiceHealth {
  status: HealthStatus;
  timestamp: string;
  error?: string;
}

/**
 * Overall health check response
 */
export interface HealthCheckResponse {
  status: HealthStatus;
  timestamp: string;
  services: {
    database: ServiceHealth;
    quranApi: ServiceHealth;
  };
}

