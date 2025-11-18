# Health Check Endpoint Documentation

## Overview

The `/api/health` endpoint provides a comprehensive health check for the application's critical services. It is designed to be polled by external monitoring bots to ensure system availability.

## Endpoint Details

**URL:** `GET /api/health`  
**Method:** `GET`  
**Authentication:** None (public endpoint)

## Response Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | All services are healthy and operational |
| `503 Service Unavailable` | One or more services are unhealthy |

## Response Format

The endpoint returns a JSON response with the following structure:

```json
{
  "status": "healthy" | "unhealthy",
  "timestamp": "ISO 8601 timestamp",
  "services": {
    "database": {
      "status": "healthy" | "unhealthy",
      "timestamp": "ISO 8601 timestamp",
      "error": "Optional error message if unhealthy"
    },
    "quranApi": {
      "status": "healthy" | "unhealthy",
      "timestamp": "ISO 8601 timestamp",
      "error": "Optional error message if unhealthy"
    }
  }
}
```

## Services Monitored

### 1. Database (MySQL)
- **Check:** Verifies MySQL database connectivity
- **Method:** Attempts to connect and ping the database
- **Timeout:** 5 seconds
- **Configuration:** Uses environment variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)

### 2. Quran API
- **Check:** Verifies Quran Foundation API availability
- **Method:** Attempts to fetch an OAuth2 access token
- **Timeout:** 5 seconds (connection timeout)
- **Configuration:** Uses environment variables (`QURAN_AUTH_API_BASE_URL`, `QURAN_CLIENT_ID`, `QURAN_CLIENT_SECRET`)

## Example Responses

### All Services Healthy (200 OK)

```json
{
  "status": "healthy",
  "timestamp": "2025-11-18T12:00:00.000Z",
  "services": {
    "database": {
      "status": "healthy",
      "timestamp": "2025-11-18T12:00:00.000Z"
    },
    "quranApi": {
      "status": "healthy",
      "timestamp": "2025-11-18T12:00:00.000Z"
    }
  }
}
```

### Database Unhealthy (503 Service Unavailable)

```json
{
  "status": "unhealthy",
  "timestamp": "2025-11-18T12:00:00.000Z",
  "services": {
    "database": {
      "status": "unhealthy",
      "timestamp": "2025-11-18T12:00:00.000Z",
      "error": "Database connection failed: connect ECONNREFUSED 127.0.0.1:3308"
    },
    "quranApi": {
      "status": "healthy",
      "timestamp": "2025-11-18T12:00:00.000Z"
    }
  }
}
```

### Quran API Unhealthy (503 Service Unavailable)

```json
{
  "status": "unhealthy",
  "timestamp": "2025-11-18T12:00:00.000Z",
  "services": {
    "database": {
      "status": "healthy",
      "timestamp": "2025-11-18T12:00:00.000Z"
    },
    "quranApi": {
      "status": "unhealthy",
      "timestamp": "2025-11-18T12:00:00.000Z",
      "error": "OAuth2 token=*** request failed: 401 Unauthorized"
    }
  }
}
```

## Monitoring Setup

### Recommended Configuration

- **Polling Interval:** Every 5 minutes
- **Timeout:** 10 seconds
- **Alert On:** HTTP status code 503 or request timeout
- **Retry Policy:** 2 retries with 10-second delay

### Example cURL Command

```bash
curl -f http://localhost:3000/api/health
```

The `-f` flag makes curl exit with a non-zero status code if the server returns an error (like 503), which is useful for monitoring scripts.

### Example Monitoring Script

```bash
#!/bin/bash
HEALTH_URL="http://localhost:3000/api/health"
MAX_RETRIES=2
RETRY_DELAY=10

for i in $(seq 1 $MAX_RETRIES); do
  if curl -f -s "$HEALTH_URL" > /dev/null; then
    echo "✓ Health check passed"
    exit 0
  fi
  
  echo "✗ Health check failed (attempt $i/$MAX_RETRIES)"
  
  if [ $i -lt $MAX_RETRIES ]; then
    sleep $RETRY_DELAY
  fi
done

echo "✗ Health check failed after $MAX_RETRIES attempts"
exit 1
```

## Security Considerations

1. **Error Sanitization:** Error messages are sanitized to prevent exposure of sensitive information (passwords, tokens, secrets)
2. **No Authentication Required:** The endpoint is public to allow monitoring bots to access it without credentials
3. **Rate Limiting:** Consider implementing rate limiting if the endpoint is exposed publicly
4. **Cache Headers:** Response includes cache-control headers to prevent caching of health status

## Troubleshooting

### Database Health Check Failing

1. Verify the database is running:
   ```bash
   docker ps | grep quran_interview_mysql
   ```

2. Check database connection from command line:
   ```bash
   mysql -h localhost -P 3308 -u nextjs -pnextjs quran
   ```

3. Verify environment variables are set correctly in `.env.local`

### Quran API Health Check Failing

1. Verify the OAuth2 API is accessible:
   ```bash
   curl https://prelive-oauth2.quran.foundation/oauth2/token
   ```

2. Verify the Content API is accessible:
   ```bash
   curl https://apis-prelive.quran.foundation/content/api/v4/chapters/1
   ```

3. Check that `QURAN_CLIENT_ID` and `QURAN_CLIENT_SECRET` are valid

4. Check application logs for detailed error messages

## Implementation Details

The health check implementation is split across multiple files:

- **`app/api/health/route.ts`** - Next.js API route handler
- **`lib/health/health-service.ts`** - Health check service logic
- **`lib/health/types.ts`** - TypeScript type definitions
- **`lib/db/connection.ts`** - Database connection utility
- **`lib/api/auth.ts`** - OAuth2 token management

For more details, see the source code or the main project README.

