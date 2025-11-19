/**
 * Generic API types
 */

/**
 * API Error Response
 */
export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}
