# Debugging: /location/delhi Returns 404

## 🔴 Root Cause Analysis

### Issue 1: `params` Must Be Awaited (Next.js 16+)

**Error in Logs:**
```
"Route "/location/[slug]" used `params.slug`. `params` is a Promise and must be 
unwrapped with `await` or `React.use()` before accessing its properties."
```

**The Problem:**
- Next.js 16 changed `params` to be a `Promise`
- Previous code tried to access `params.slug` directly
- This returned `undefined`, causing API calls with `slug=undefined`

**The Fix:**
```typescript
// ❌ BEFORE (Next.js 15 style)
export default async function LocationPage({ params }: LocationPageProps) {
  const location = await getLocationBySlug(params.slug); // params.slug is undefined!
}

// ✅ AFTER (Next.js 16 style)
export default async function LocationPage({ 
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise; // Correctly await params first
  const location = await getLocationBySlug(slug);
}
```

---

### Issue 2: API Response Format Handling

**Problem:**
The API response format might differ from what the code expects.

**Different Response Formats:**
```typescript
// Format 1: Direct response
{ id: "1", name: "Delhi", slug: "delhi" }

// Format 2: Wrapped in .data array
{ data: [{ id: "1", name: "Delhi", slug: "delhi" }] }

// Format 3: Wrapped in .data object
{ data: { id: "1", name: "Delhi", slug: "delhi" } }
```

**The Fix:**
Added flexible response handling that checks all formats:

```typescript
export async function getLocationBySlug(slug: string) {
  const response = await fetchFromAPI(`/locations?slug=${slug}`);
  
  // Check if response is the data directly
  if (response && response.name && response.slug) {
    return response;
  }
  
  // Check if response has .data array
  if (Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  
  // Check if response has .data object
  if (response.data && response.data.name) {
    return response.data;
  }
  
  return null;
}
```

---

## ✅ What Was Fixed

### Fixed Files:

1. **`app/location/[slug]/page.tsx`**
   - Changed `params: { slug: string }` → `params: Promise<{ slug: string }>`
   - Added `const { slug } = await paramsPromise;`
   - Fixed both `generateMetadata` and component

2. **`app/developer/[slug]/page.tsx`**
   - Changed `params: { slug: string }` → `params: Promise<{ slug: string }>`
   - Added `const { slug } = await paramsPromise;`
   - Fixed both `generateMetadata` and component

3. **`lib/api/properties-listing.ts`**
   - Enhanced `getLocationBySlug()` with flexible response handling
   - Enhanced `getDeveloperBySlug()` with flexible response handling
   - Added better error logging

---

## 🧪 Testing the Fix

### Step 1: Verify the Fix
```bash
npm run dev
```

### Step 2: Test the URLs
- Visit: `http://localhost:3001/location/delhi`
- Visit: `http://localhost:3001/developer/dlf`

### Step 3: Check the Console
Look for these log messages:
```
[API] Fetching: GET http://localhost:3000/api/v1/locations?slug=delhi
[API] Response: GET http://localhost:3000/api/v1/locations?slug=delhi -> 200
[API] Success: GET http://localhost:3000/api/v1/locations?slug=delhi
```

If you see `[API] Fetching: ... slug=undefined`, the params issue still exists.

---

## 🔧 Troubleshooting

### Issue: Still getting 404

**Possible Causes:**

1. **Backend API not running**
   - Verify backend is running on `http://localhost:3000`
   - Check `/api/v1/locations?slug=delhi` endpoint works

2. **No data in database**
   - Make sure there's a location with slug "delhi" in the database
   - Check backend logs for queries

3. **API returns wrong format**
   - Check what `/api/v1/locations?slug=delhi` actually returns
   - Adjust response handling if needed

### Debug Steps:

```bash
# 1. Check if API is running
curl http://localhost:3000/api/v1/locations?slug=delhi

# 2. Check Next.js dev console for errors
# Look for "Error fetching location:" messages

# 3. Check browser DevTools
# Network tab → See what /api/v1/locations returns

# 4. Add temporary debug logging
// In getLocationBySlug()
console.log('API Response:', response);
console.log('Location found:', location);
```

---

## 📋 Checklist

After applying fixes:

- [ ] `npm run dev` runs without "params is a Promise" error
- [ ] `/location/delhi` returns 200 (not 404)
- [ ] API logs show `slug=delhi` (not `slug=undefined`)
- [ ] Location hero displays correctly
- [ ] Properties load below hero
- [ ] Filters work
- [ ] Sorting works
- [ ] Pagination works
- [ ] `/developer/dlf` also works

---

## 🎯 Key Learnings

### Next.js 16 Breaking Changes

```typescript
// Next.js 15 (Old way)
export async function generateMetadata({ params }) {
  const slug = params.slug; // ✅ Works
}

// Next.js 16 (New way)
export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ Required
  // OR
  const slug = (await params).slug; // ✅ Also works
}
```

### Dynamic Routes in Next.js 16+

```typescript
// ✅ Correct
async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}

// ❌ Wrong (will cause errors)
async function Page({ params }: { params: { id: string } }) {
  console.log(params.id); // undefined!
}
```

---

## 📚 References

- [Next.js 16 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-16)
- [Dynamic Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

---

**Status:** ✅ Fixed and Ready to Test

If you still see issues, check the browser console and Next.js dev console for error messages.
