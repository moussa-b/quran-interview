# API Endpoints Summary

This document provides an overview of the API endpoints available for the Quran Topics Taxonomy.

## Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/topics` | GET | List all topics |
| `/api/topics/:id` | GET | Get single topic |
| `/api/categories` | GET | List categories (optional: filter by topic) |
| `/api/categories/:id` | GET | Get single category |
| `/api/subcategories` | GET | List subcategories (optional: filter by category) |
| `/api/subcategories/:id` | GET | Get single subcategory |
| `/api/items` | GET | List items (optional: filter by category/subcategory) |
| `/api/items/:id` | GET | Get single item with Quran references |

## Common Query Parameters

All endpoints support:
- `language` (optional): Language code for filtering translations (e.g., 'en', 'fr')

Additional filters:
- `/api/categories`: `topic_id` - Filter by topic
- `/api/subcategories`: `category_id` - Filter by category
- `/api/items`: `category_id` or `subcategory_id` - Filter by parent

## Example Requests

```bash
# Get all topics in English
curl http://localhost:3000/api/topics?language=en

# Get categories for topic 1 in French
curl http://localhost:3000/api/categories?topic_id=1&language=fr

# Get subcategories for category 1
curl http://localhost:3000/api/subcategories?category_id=1&language=en

# Get items for subcategory 1 with Quran references
curl http://localhost:3000/api/items?subcategory_id=1&language=en

# Get a specific item by ID
curl http://localhost:3000/api/items/340?language=en
```

## Project Structure

```
lib/api/topics/              # Business logic layer
├── types.ts                 # TypeScript interfaces
├── service.ts               # Database query functions
├── index.ts                 # Module exports
└── README.md                # Detailed documentation

app/api/                     # HTTP API routes (Next.js)
├── topics/
│   ├── route.ts            # List endpoint
│   └── [id]/route.ts       # Detail endpoint
├── categories/
│   ├── route.ts
│   └── [id]/route.ts
├── subcategories/
│   ├── route.ts
│   └── [id]/route.ts
└── items/
    ├── route.ts
    └── [id]/route.ts
```

## Data Relationships

```
Topic
  ↓ (has many)
Category
  ↓ (has many)
Subcategory
  ↓ (has many)
Item
  ↓ (has many)
ItemQuranRef (verse references)
```

**Note:** Items can belong to either a Category OR a Subcategory (category_id or subcategory_id will be set, but not both).

## Response Format

All endpoints return JSON with a consistent structure:

### Success Response
```json
{
  "topics": [...],      // For collection endpoints
  "topic": {...}        // For single resource endpoints
}
```

### Error Response
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad request (invalid parameters)
- `404` - Resource not found
- `500` - Internal server error

## For More Details

See the comprehensive documentation at: `lib/api/topics/README.md`

