# API TESTING GUIDE
**Reality Estate Backend - Complete Endpoint Testing**

---

## BASE URL
```
http://localhost:3000/api/v1
```

---

## 1. AUTHENTICATION TESTING

### Register Admin User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid-here",
      "email": "admin@example.com",
      "role": "SUPER_ADMIN"
    }
  },
  "message": "Admin registered successfully"
}
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid-here",
      "email": "admin@example.com",
      "role": "SUPER_ADMIN"
    }
  },
  "message": "Login successful"
}
```

**Save the token for authenticated requests:**
```bash
TOKEN="<paste-token-here>"
```

---

## 2. DEVELOPER TESTING

### Create Developers (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/developers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Lodha Group",
    "slug": "lodha-group",
    "logo": "https://example.com/lodha.png"
  }'
```

❌ **Note:** No create endpoint for developers exists yet. Use direct database insert for testing.

### List Developers (Public)
```bash
curl http://localhost:3000/api/v1/developers
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Lodha Group",
      "slug": "lodha-group",
      "logo": "https://example.com/lodha.png"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

### Get Developer by ID (Public)
```bash
curl http://localhost:3000/api/v1/developers/{id}
```

### Get Properties by Developer (Public)
```bash
curl http://localhost:3000/api/v1/developers/{id}/properties
```

---

## 3. LOCATION TESTING

### Create Locations (Need DB Insert)

Insert via database:
```sql
INSERT INTO locations (id, name, slug, type, "parentId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'India',
  'india',
  'country',
  NULL,
  NOW(),
  NOW()
);

INSERT INTO locations (id, name, slug, type, "parentId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Delhi',
  'delhi',
  'state',
  id,
  NOW(),
  NOW()
FROM locations WHERE slug = 'india';
```

### List Locations (Public)
```bash
curl http://localhost:3000/api/v1/locations
```

**Expected Response:** Hierarchical with children
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "India",
      "slug": "india",
      "type": "country",
      "children": [
        {
          "id": "uuid",
          "name": "Delhi",
          "slug": "delhi",
          "type": "state"
        }
      ]
    }
  ]
}
```

### List by Type
```bash
curl "http://localhost:3000/api/v1/locations?type=state"
```

### Get Location by ID
```bash
curl http://localhost:3000/api/v1/locations/{id}
```

### Get Properties in Location
```bash
curl http://localhost:3000/api/v1/locations/{id}/properties
```

---

## 4. CATEGORY TESTING

### Create Categories (DB Insert)
```sql
INSERT INTO categories (id, name, slug, "propertyType", "parentId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Luxury',
  'luxury',
  'residential',
  NULL,
  NOW(),
  NOW()
);

INSERT INTO categories (id, name, slug, "propertyType", "parentId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Ultra Luxury',
  'ultra-luxury',
  'residential',
  id,
  NOW(),
  NOW()
FROM categories WHERE slug = 'luxury';
```

### List Categories
```bash
curl http://localhost:3000/api/v1/categories
```

### Filter by Property Type
```bash
curl "http://localhost:3000/api/v1/categories?propertyType=residential"
```

### Get Category by ID
```bash
curl http://localhost:3000/api/v1/categories/{id}
```

### Get Properties in Category
```bash
curl http://localhost:3000/api/v1/categories/{id}/properties
```

---

## 5. PROPERTY TESTING

### Create Property (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "lodha-world-towers",
    "title": "Lodha World Towers",
    "propertyType": "residential",
    "developerId": "developer-uuid",
    "locationId": "location-uuid",
    "status": "active",
    "priceMin": 10000000,
    "priceMax": 50000000,
    "isPublished": true
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "property-uuid",
    "slug": "lodha-world-towers",
    "title": "Lodha World Towers",
    ...
  },
  "message": "Property created successfully"
}
```

### List Properties (Public)
```bash
curl http://localhost:3000/api/v1/properties
```

### Filter Properties - By Type
```bash
curl "http://localhost:3000/api/v1/properties?propertyType=residential"
```

### Filter - By Location
```bash
curl "http://localhost:3000/api/v1/properties?locationId=location-uuid"
```

### Filter - By Developer
```bash
curl "http://localhost:3000/api/v1/properties?developerId=developer-uuid"
```

### Filter - By Price Range
```bash
curl "http://localhost:3000/api/v1/properties?priceMin=10000000&priceMax=50000000"
```

### Filter - By Categories (Many-to-Many)
```bash
curl "http://localhost:3000/api/v1/properties?categoryIds=category-uuid-1,category-uuid-2"
```

### Filter - Published Only
```bash
curl "http://localhost:3000/api/v1/properties?isPublished=true"
```

### Filter - Combined Filters
```bash
curl "http://localhost:3000/api/v1/properties?propertyType=residential&locationId=location-uuid&priceMin=10000000&priceMax=50000000&isPublished=true"
```

### Pagination
```bash
# Page 1 (default)
curl "http://localhost:3000/api/v1/properties?limit=10&offset=0"

# Page 2
curl "http://localhost:3000/api/v1/properties?limit=10&offset=10"
```

### Get Property by Slug (Public)
```bash
curl http://localhost:3000/api/v1/properties/lodha-world-towers
```

**Expected Response:** Returns property with sections ordered
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "lodha-world-towers",
    "PropertySections": [
      {
        "id": "section-uuid",
        "type": "overview",
        "title": "Property Overview",
        "order": 1,
        "data": { ... }
      },
      {
        "id": "section-uuid",
        "type": "amenities",
        "title": "Amenities",
        "order": 2,
        "data": { ... }
      }
    ]
  }
}
```

### Update Property (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/properties/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Lodha World Towers - Updated",
    "isPublished": false
  }'
```

### Delete Property (Protected)
```bash
curl -X DELETE http://localhost:3000/api/v1/properties/{id} \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

## 6. PROPERTY SECTIONS TESTING

### Create Sections via CRM Integration (x-api-key)
```bash
CRM_KEY="your-crm-api-key"

curl -X POST http://localhost:3000/api/v1/crm/properties \
  -H "Content-Type: application/json" \
  -H "x-api-key: $CRM_KEY" \
  -d '{
    "slug": "property-with-sections",
    "title": "Property With Sections",
    "propertyType": "residential",
    "developerId": "dev-uuid",
    "locationId": "loc-uuid",
    "isPublished": true,
    "sections": [
      {
        "type": "overview",
        "title": "Overview",
        "order": 1,
        "isVisible": true,
        "data": {
          "description": "Beautiful property",
          "features": ["pool", "gym"]
        }
      },
      {
        "type": "amenities",
        "title": "Amenities",
        "order": 2,
        "isVisible": true,
        "data": {
          "list": ["Swimming Pool", "Gym", "Garden"]
        }
      }
    ]
  }'
```

### Update Sections via CRM
```bash
curl -X POST http://localhost:3000/api/v1/crm/properties/{propertyId}/sections \
  -H "Content-Type: application/json" \
  -H "x-api-key: $CRM_KEY" \
  -d '{
    "sections": [
      {
        "type": "gallery",
        "title": "Photo Gallery",
        "order": 1,
        "data": {
          "images": ["img1.jpg", "img2.jpg"]
        }
      }
    ]
  }'
```

---

## 7. BLOG TESTING

### Create Blog (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Real Estate Trends 2026",
    "slug": "real-estate-trends-2026",
    "content": "Lorem ipsum dolor sit amet...",
    "isPublished": false
  }'
```

### List Published Blogs (Public)
```bash
curl http://localhost:3000/api/v1/blogs
```

### Get Blog by Slug (Public)
```bash
curl http://localhost:3000/api/v1/blogs/real-estate-trends-2026
```

### Update Blog (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/blogs/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "isPublished": true
  }'
```

### Delete Blog (Protected)
```bash
curl -X DELETE http://localhost:3000/api/v1/blogs/{id} \
  -H "Authorization: Bearer $TOKEN"
```

---

## 8. LEAD CRM TESTING

### Create Lead (Public - Form Endpoint)
```bash
curl -X POST http://localhost:3000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "source": "website",
    "propertyId": "property-uuid"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "lead-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "status": "new",
    "source": "website",
    "propertyId": "property-uuid"
  },
  "message": "Lead created successfully"
}
```

### List Leads (Protected - Admin)
```bash
curl http://localhost:3000/api/v1/leads \
  -H "Authorization: Bearer $TOKEN"
```

### Filter Leads
```bash
# By status
curl "http://localhost:3000/api/v1/leads?status=new" \
  -H "Authorization: Bearer $TOKEN"

# By property
curl "http://localhost:3000/api/v1/leads?propertyId=property-uuid" \
  -H "Authorization: Bearer $TOKEN"

# By source
curl "http://localhost:3000/api/v1/leads?source=website" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Lead by ID (Protected)
```bash
curl http://localhost:3000/api/v1/leads/{id} \
  -H "Authorization: Bearer $TOKEN"
```

### Update Lead Status (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/leads/{id}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "contacted"
  }'
```

**Valid Statuses:** new → contacted → qualified → interested → converted/lost

---

## 9. HEALTH CHECK

### System Health
```bash
curl http://localhost:3000/api/v1/health
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2026-01-31T10:00:00.000Z",
  "environment": "development"
}
```

---

## FILTERING LOGIC TEST SCENARIOS

### Scenario 1: Find Residential Properties under 50 Lakh
```bash
curl "http://localhost:3000/api/v1/properties?propertyType=residential&priceMax=5000000"
```

### Scenario 2: Find All Luxury Residential in Delhi
```bash
curl "http://localhost:3000/api/v1/properties?propertyType=residential&locationId=DELHI_ID&categoryIds=LUXURY_ID"
```

### Scenario 3: Published Properties by Specific Developer
```bash
curl "http://localhost:3000/api/v1/properties?developerId=DEV_ID&isPublished=true"
```

### Scenario 4: Multi-Category Filter
```bash
curl "http://localhost:3000/api/v1/properties?categoryIds=CAT1,CAT2,CAT3"
```

### Scenario 5: Price Range with Pagination
```bash
curl "http://localhost:3000/api/v1/properties?priceMin=1000000&priceMax=10000000&limit=20&offset=0"
```

---

## ERROR HANDLING TESTS

### Test 401 - No Token
```bash
curl -X POST http://localhost:3000/api/v1/properties \
  -H "Content-Type: application/json" \
  -d '{"slug": "test"}'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

### Test 400 - Validation Error
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "123"}'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "body.email",
      "message": "Invalid email"
    },
    {
      "field": "body.password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Test 404 - Not Found
```bash
curl http://localhost:3000/api/v1/properties/nonexistent-slug
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Property not found"
}
```

### Test 409 - Duplicate Email
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'
```

**Expected Response (409):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

## QUERY OPTIMIZATION VERIFICATION

To verify no N+1 queries:

1. Enable SQL logging in `.env`: Already enabled in development
2. Run property list query with includes:
   ```bash
   curl "http://localhost:3000/api/v1/properties"
   ```
3. Check logs - should see:
   - ONE query for properties
   - ONE query for developers (join)
   - ONE query for locations (join)
   - ONE query for categories (join)
   - Total: 4 queries max (not N+1)

---

## SETUP FOR TESTING

```bash
# 1. Start server
npm run dev

# 2. In another terminal, run migrations
npm run db:migrate

# 3. Register admin
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# 4. Copy token and set
TOKEN="<paste-token>"

# 5. Insert test data into database
# Use seed scripts or direct SQL

# 6. Run API tests
# Use curl commands above
```

---

## NOTES

- Replace `{id}`, `{uuid}`, etc. with actual IDs from your database
- Use `$TOKEN` for authenticated requests after login
- Use `$CRM_KEY` for CRM integration endpoints
- All timestamps are ISO 8601 format
- All UUIDs are v4
- Pagination defaults: limit=10, offset=0, max limit=100
