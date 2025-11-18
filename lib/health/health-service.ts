import { checkDatabaseConnection } from '@/lib/db';
import { getChapter } from '@/lib/api';
import { ServiceHealth } from './types';

/**
 * Check MySQL database health
 * 
 * @returns Promise with service health status
 */
export async function checkMySQLHealth(): Promise<ServiceHealth> {
  const timestamp = new Date().toISOString();

  try {
    await checkDatabaseConnection();
    
    return {
      status: 'healthy',
      timestamp,
    };
  } catch (error) {
    const err = error as Error;
    return {
      status: 'unhealthy',
      timestamp,
      error: sanitizeError(err.message),
    };
  }
}

/**
 * Check Quran API health by attempting to fetch a chapter
 * This validates both OAuth2 authentication and content API connectivity
 * 
 * @returns Promise with service health status
 */
export async function checkQuranAPIHealth(): Promise<ServiceHealth> {
  const timestamp = new Date().toISOString();

  try {
    // Try to fetch chapter 1 (Al-Fatihah)
    // This validates both OAuth2 token generation and content API availability
    await getChapter(1);
    
    return {
      status: 'healthy',
      timestamp,
    };
  } catch (error) {
    const err = error as Error;
    return {
      status: 'unhealthy',
      timestamp,
      error: sanitizeError(err.message),
    };
  }
}

/**
 * Sanitize error messages to avoid exposing sensitive information
 * 
 * @param message - Error message to sanitize
 * @returns Sanitized error message
 */
function sanitizeError(message: string): string {
  // Remove potential sensitive information like passwords, tokens, etc.
  let sanitized = message
    .replace(/password[^\s]*/gi, 'password=***')
    .replace(/token[^\s]*/gi, 'token=***')
    .replace(/secret[^\s]*/gi, 'secret=***')
    .replace(/[a-f0-9]{32,}/gi, '***'); // Remove long hex strings (potential tokens)

  // Truncate very long messages
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200) + '...';
  }

  return sanitized;
}

/**
 * Run all health checks in parallel
 * 
 * @returns Promise with all service health results
 */
export async function runAllHealthChecks(): Promise<{
  database: ServiceHealth;
  quranApi: ServiceHealth;
}> {
  const [database, quranApi] = await Promise.all([
    checkMySQLHealth(),
    checkQuranAPIHealth(),
  ]);

  return {
    database,
    quranApi,
  };
}

