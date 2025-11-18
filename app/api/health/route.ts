import { NextResponse } from 'next/server';
import { runAllHealthChecks } from '@/lib/health/health-service';
import { HealthCheckResponse, HealthStatus } from '@/lib/health/types';

/**
 * GET /api/health
 * 
 * Health check endpoint that verifies MySQL database and Quran API connectivity.
 * Returns HTTP 200 if all services are healthy, HTTP 503 if any service is unhealthy.
 * 
 * This endpoint is designed to be polled by external monitoring bots every 5 minutes.
 * 
 * @returns JSON response with overall status and individual service statuses
 */
export async function GET() {
  try {
    // Run all health checks in parallel
    const services = await runAllHealthChecks();

    // Determine overall health status
    const allHealthy = services.database.status === 'healthy' && 
                       services.quranApi.status === 'healthy';
    
    const overallStatus: HealthStatus = allHealthy ? 'healthy' : 'unhealthy';
    const timestamp = new Date().toISOString();

    const response: HealthCheckResponse = {
      status: overallStatus,
      timestamp,
      services,
    };

    // Return 503 if any service is unhealthy, 200 if all are healthy
    const statusCode = allHealthy ? 200 : 503;

    return NextResponse.json(response, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    // If something unexpected happens, return 503 with error details
    const err = error as Error;
    const timestamp = new Date().toISOString();
    
    const response: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp,
      services: {
        database: {
          status: 'unhealthy',
          timestamp,
          error: 'Health check failed',
        },
        quranApi: {
          status: 'unhealthy',
          timestamp,
          error: 'Health check failed',
        },
      },
    };

    console.error('Health check endpoint error:', err);

    return NextResponse.json(response, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}

