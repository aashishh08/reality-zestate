# Available Properties in Backend (Port 4002)

## ✅ Properties That Work

### 1. Mahindra Origins - Pune
```
URL: http://localhost:3001/projects/mahindra-origins-pune
Slug: mahindra-origins-pune
Type: Residential
Price: ₹ 8 Cr - ₹ 3.5 Cr
Location: Pune, Maharashtra
Developer: Mahindra Lifespace
```

### 2. DLF Cyber Hub - Gurgaon
```
URL: http://localhost:3001/projects/dlf-cyber-hub-gurgaon
Slug: dlf-cyber-hub-gurgaon
Type: Commercial
Price: ₹ 5 Cr - ₹ 20 Cr
Location: Gurgaon, Haryana
Developer: DLF
```

### 3. Godrej Aqua - Mumbai
```
URL: http://localhost:3001/projects/godrej-aqua-mumbai
Slug: godrej-aqua-mumbai
Type: Residential
Price: ₹ 2 Cr - ₹ 10 Cr
Location: Mumbai, Maharashtra
Developer: Godrej
```

### 4. Lodha Park - Mumbai
```
URL: http://localhost:3001/projects/lodha-park-mumbai
Slug: lodha-park-mumbai
Type: Residential
Price: ₹ 1.8 Cr - ₹ 8.5 Cr
Location: Mumbai, Maharashtra
Developer: Lodha
```

### 5. Emaar Elements - Delhi
```
URL: http://localhost:3001/projects/emaar-elements-delhi
Slug: emaar-elements-delhi
Type: Residential
Price: ₹ 1.5 Cr - ₹ 7.5 Cr
Location: New Delhi, Delhi
Developer: Emaar
```

### 6. DLF Prime - Gurgaon
```
URL: http://localhost:3001/projects/dlf-prime-gurgaon
Slug: dlf-prime-gurgaon
Type: Residential
Price: ₹ 1 Cr - ₹ 5 Cr
Location: Gurgaon, Haryana
Developer: DLF
```

---

## ❌ Properties That Don't Exist (Will 404)

### lodha-supreme-delhi
```
URL: http://localhost:3001/projects/lodha-supreme-delhi
Status: 404 - Not Found
Reason: Not in seeder file, only exists in old database (port 3000)
```

---

## 🔧 How to Test

### 1. Start Backend (if not running)
```bash
cd /Users/aashishkumar/Desktop/reality-estate/backend
npm run dev
# Should run on port 4002
```

### 2. Restart Frontend (IMPORTANT - to pick up new env vars)
```bash
cd /Users/aashishkumar/Desktop/reality-estate/frontend
# Stop current server (Ctrl+C in terminal)
npm run dev
# Should run on port 3001
```

### 3. Test URLs
Open these in your browser:
- ✅ http://localhost:3001/projects/emaar-elements-delhi
- ✅ http://localhost:3001/projects/lodha-park-mumbai
- ✅ http://localhost:3001/projects/dlf-prime-gurgaon
- ❌ http://localhost:3001/projects/lodha-supreme-delhi (will 404)

### 4. Check Backend API Directly
```bash
# List all properties
curl http://localhost:4002/api/v1/properties | jq

# Get specific property
curl http://localhost:4002/api/v1/properties/emaar-elements-delhi | jq

# Test non-existent property
curl http://localhost:4002/api/v1/properties/lodha-supreme-delhi
# Response: {"success":false,"message":"Property not found"}
```

---

## 📝 How to Add New Properties

### Option 1: Via Seeder (Recommended for Development)

1. Edit seeder file:
```bash
nano /Users/aashishkumar/Desktop/reality-estate/backend/src/seeders/20260210000001-seed-initial-data.js
```

2. Add new property to the `properties` array:
```javascript
{
  slug: 'lodha-supreme-delhi',
  title: 'Lodha Supreme',
  propertyType: 'residential',
  developerId: developerIds['lodha'],
  locationId: cityIds['new-delhi'],
  priceMin: 15000000,
  priceMax: 32000000,
  isPublished: true,
},
```

3. Clear database and re-run seeder:
```bash
cd backend

# Option A: Drop all tables and re-create
npm run db:migrate:undo:all
npm run db:migrate
npm run db:seed

# Option B: Just re-run seeder (if tables exist)
npm run db:seed
```

### Option 2: Via API (For Production)

```bash
# Login first to get JWT token (if auth is enabled)
# Then create property
curl -X POST http://localhost:4002/api/v1/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "slug": "lodha-supreme-delhi",
    "title": "Lodha Supreme",
    "propertyType": "residential",
    "developerId": "DEVELOPER_UUID",
    "locationId": "LOCATION_UUID",
    "priceMin": 15000000,
    "priceMax": 32000000,
    "isPublished": true
  }'
```

---

## 🐛 Troubleshooting

### Issue: Still getting 404
**Solution:** Make sure you restarted the frontend server after changing `.env.local`

```bash
# Terminal with frontend running - press Ctrl+C
# Then restart
npm run dev
```

### Issue: "Backend Connection Error"
**Check:**
1. Backend is running: `curl http://localhost:4002/api/v1/health`
2. Database is running: Check Docker or local PostgreSQL
3. Environment variables are correct in `/backend/.env`

### Issue: Property exists but shows as "not found"
**Check:**
1. `isPublished` is `true` in database
2. Slug matches exactly (case-sensitive)
3. Backend logs for SQL errors

### Issue: Old data showing
**Solution:** Clear Next.js cache
```bash
cd frontend
rm -rf .next
npm run dev
```

---

## 📊 Database Schema Reference

```sql
-- Check all properties
SELECT id, slug, title, "isPublished" FROM properties;

-- Check specific property
SELECT * FROM properties WHERE slug = 'emaar-elements-delhi';

-- Check with developer and location
SELECT 
  p.slug,
  p.title,
  d.name as developer,
  l.name as location
FROM properties p
JOIN developers d ON p."developerId" = d.id
JOIN locations l ON p."locationId" = l.id
WHERE p."isPublished" = true;
```

---

## ✅ Quick Verification Checklist

- [ ] Backend running on port 4002
- [ ] Frontend restarted after `.env.local` change
- [ ] Database has seeded properties
- [ ] Can access: http://localhost:3001/projects/emaar-elements-delhi
- [ ] Backend API responds: http://localhost:4002/api/v1/properties
- [ ] Logs show correct API URL: `[API] Fetching: GET http://localhost:4002/api/v1/properties/...`

---

**Last Updated:** February 15, 2026  
**Backend Port:** 4002  
**Frontend Port:** 3001  
**Database:** PostgreSQL (via Docker/Local)
