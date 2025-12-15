import { NextResponse } from 'next/server';
import packageJson from '../../../package.json';

/**
 * GET /api/version
 * 
 * Version endpoint that returns the application version from package.json.
 * Returns HTTP 200 with the version information.
 * 
 * @returns JSON response with version string
 */
export async function GET() {
  try {
    const version = packageJson.version;

    return NextResponse.json(
      { version },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    // If something unexpected happens, return 500 with error details
    const err = error as Error;
    console.error('Version endpoint error:', err);

    return NextResponse.json(
      { 
        version: 'unknown',
        error: 'Failed to retrieve version',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
}

