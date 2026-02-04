# Centralized Property Listing Pages - Implementation Guide

## Overview

This document describes the implementation of centralized, reusable property listing pages for locations, developers, categories, and other filtering scenarios.

**Architecture:** Component-based, server-side data fetching, client-side filtering/sorting/pagination
**Performance:** ISR with 1-hour revalidation, dynamic static params for unlimited pages
**Features:** Filtering, sorting, pagination, responsive design, error handling

---

## 📁 File Structure

```
frontend/
├── app/
│   ├── location/[slug]/page.tsx          ✅ NEW - Location properties page
│   ├── developer/[slug]/page.tsx         ✅ NEW - Developer properties page
│   └── category/[slug]/page.tsx          (can use same template)
│
├── components/
│   ├── PropertyListingTemplate.tsx       ✅ NEW - Reusable template
│   ├── PropertyCard.tsx                  (existing - reused)
│   ├── filters/
│   │   ├── PropertyFilters.tsx           ✅ NEW - Filter UI
│   │   └── PropertySort.tsx              ✅ NEW - Sort UI
│   ├── ui/
│   │   └── Pagination.tsx                ✅ NEW - Pagination UI
│   ├── location/
│   │   └── LocationHero.tsx              ✅ NEW - Hero section
│   └── developer/
│       └── DeveloperHero.tsx             ✅ NEW - Hero section
│
├── lib/
│   ├── api/properties-listing.ts         ✅ NEW - API helpers
│   └── api-client.ts                     (existing - used by API helpers)
│
└── types/
    └── property-listing.ts               ✅ NEW - Type definitions
```

---

## 🚀 Quick Start

### 1. Location Page (`/location/delhi`)

```typescript
// app/location/[slug]/page.tsx
import { PropertyListingTemplate } from '@/components/PropertyListingTemplate';
import { fetchLocationProperties } from '@/lib/api/properties-listing';

export default async function LocationPage({ params }) {
  const location = await getLocationBySlug(params.slug);
  const initialData = await fetchLocationProperties(location.id);

  return (
    <PropertyListingTemplate
      initialData={initialData}
      onFetchProperties={(filters) => fetchLocationProperties(location.id, filters)}
      title={`Properties in ${location.name}`}
      contextFilters={{ locationId: location.id }}
    />
  );
}
```

### 2. Developer Page (`/developer/dlf`)

```typescript
// app/developer/[slug]/page.tsx
import { PropertyListingTemplate } from '@/components/PropertyListingTemplate';
import { fetchDeveloperProperties } from '@/lib/api/properties-listing';

export default async function DeveloperPage({ params }) {
  const developer = await getDeveloperBySlug(params.slug);
  const initialData = await fetchDeveloperProperties(developer.id);

  return (
    <PropertyListingTemplate
      initialData={initialData}
      onFetchProperties={(filters) => fetchDeveloperProperties(developer.id, filters)}
      title={`${developer.name} Projects`}
      contextFilters={{ developerId: developer.id }}
    />
  );
}
```

### 3. Custom Listing Page (Any Combination)

```typescript
// Example: Properties with specific filters
export default async function AffordablePropertiesPage() {
  const initialData = await fetchProperties({
    propertyType: 'residential',
    priceMax: 50000000, // ₹50L
    limit: 12,
  });

  return (
    <PropertyListingTemplate
      initialData={initialData}
      onFetchProperties={(filters) =>
        fetchProperties({
          ...filters,
          propertyType: 'residential',
          priceMax: 50000000,
        })
      }
      title="Affordable Residential Properties"
      contextFilters={{
        propertyType: 'residential',
        priceMax: 50000000,
      }}
    />
  );
}
```

---

## 🎯 Core Components

### 1. PropertyListingTemplate (Main Component)

**Purpose:** Orchestrates the entire property listing experience

**Props:**

```typescript
interface PropertyListingTemplateProps {
  // Required
  initialData: PropertyListResponse;
  onFetchProperties: (filters: PropertyFilters) => Promise<PropertyListResponse>;
  title: string;

  // Optional
  subtitle?: string;
  heroComponent?: React.ReactNode;
  sortOptions?: SortOption[];
  showFilters?: boolean;
  contextFilters?: Partial<PropertyFilters>;
  itemsPerPage?: number;
  loadingSkeletonCount?: number;
  noResultsMessage?: string;
}
```

**Features:**
- Manages filter state
- Handles pagination
- Shows loading/error/empty states
- Mobile-responsive with sidebar + modal filters
- Smooth animations with Framer Motion

**Usage:**

```typescript
<PropertyListingTemplate
  initialData={data}
  onFetchProperties={fetchFunction}
  title="My Listing Page"
  showFilters={true}
  itemsPerPage={12}
/>
```

### 2. PropertyFilters Component

**Purpose:** Provides filter UI for users

**Features:**
- Property type filter (residential/commercial)
- Price range filter
- Expandable sections
- Responsive design (sidebar on desktop, modal on mobile)
- Filter reset button

**Current Filters:**
- Property Type: Residential, Commercial
- Price Range: ₹50L, ₹50L-₹1Cr, ₹1Cr-₹2.5Cr, ₹2.5Cr-₹5Cr, ₹5Cr+

**Easy to Extend:**
```typescript
// Add location filter
<FilterSection title="Location">
  <LocationCheckboxList />
</FilterSection>

// Add amenities filter
<FilterSection title="Amenities">
  <AmenitiesCheckboxList />
</FilterSection>
```

### 3. PropertySort Component

**Purpose:** Sort properties by different criteria

**Sort Options:**
- Newest First (default)
- Price: Low to High
- Price: High to Low
- Name: A to Z

**Customizable:**
```typescript
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Cheapest' },
  { value: 'price-desc', label: 'Most Expensive' },
  { value: 'name-asc', label: 'Alphabetical' },
  { value: 'featured', label: 'Featured First' },
];
```

### 4. Pagination Component

**Purpose:** Navigate through property pages

**Features:**
- Customizable visible page range (default: 5 pages)
- Ellipsis for gaps (... between page numbers)
- Previous/Next buttons
- Smooth scrolling to top on page change
- Shows current page info

**Usage:**
```typescript
<Pagination
  currentPage={3}
  totalPages={50}
  onPageChange={handlePageChange}
  hasNextPage={true}
  hasPreviousPage={true}
  maxVisiblePages={5}
/>
```

### 5. LocationHero & DeveloperHero

**Purpose:** Context-aware hero sections

**Features:**
- Breadcrumb navigation
- Location/Developer info display
- Branded styling
- Responsive design

---

## 🔧 API Helpers (`lib/api/properties-listing.ts`)

### Fetch Functions

```typescript
// Fetch properties in a location
await fetchLocationProperties(locationId, filters);

// Fetch properties by a developer
await fetchDeveloperProperties(developerId, filters);

// Fetch properties in a category
await fetchCategoryProperties(categoryId, filters);

// Generic fetch with any filters
await fetchProperties(filters);

// Get location/developer/category details
await getLocationBySlug(slug);
await getDeveloperBySlug(slug);

// For static params generation
await getAllLocationSlugs();
await getAllDeveloperSlugs();
```

### Example Filter Usage

```typescript
const filters: PropertyFilters = {
  propertyType: 'residential',
  priceMin: 25000000,      // ₹2.5Cr
  priceMax: 100000000,     // ₹10Cr
  sortBy: 'price-asc',
  limit: 12,
  offset: 0,
};

const result = await fetchProperties(filters);
// result.data -> Array of properties
// result.pagination -> { limit, offset, total }
```

---

## 📊 Type Definitions

### PropertyFilters

```typescript
interface PropertyFilters {
  propertyType?: 'residential' | 'commercial';
  locationId?: string;
  developerId?: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  limit?: number;
  offset?: number;
}
```

### PropertyListResponse

```typescript
interface PropertyListResponse {
  data: Property[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
```

---

## 🎨 Customization Guide

### Add Custom Filter

```typescript
// In PropertyFilters.tsx
const BEDROOMS = [
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4+ BHK' },
];

// Add in component
<FilterSection title="Bedrooms">
  <div className="space-y-3">
    {BEDROOMS.map(option => (
      <label key={option.value}>
        <input
          type="checkbox"
          onChange={() => handleBedroomChange(option.value)}
        />
        <span>{option.label}</span>
      </label>
    ))}
  </div>
</FilterSection>
```

### Add Custom Sort Option

```typescript
const customSortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'availability', label: 'Available Soon' },
];

<PropertySort
  sortOptions={customSortOptions}
  currentSort={filters.sortBy}
  onSortChange={handleSort}
/>
```

### Customize Items Per Page

```typescript
<PropertyListingTemplate
  ...
  itemsPerPage={24}  // Show 24 properties per page instead of 12
/>
```

### Customize No Results Message

```typescript
<PropertyListingTemplate
  ...
  noResultsMessage="We couldn't find any luxury penthouses in your budget!"
/>
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────┐
│ Server Component (page.tsx)                         │
│ - Fetch location/developer metadata                 │
│ - Fetch initial properties                          │
│ - Pass to template                                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ PropertyListingTemplate (Client Component)          │
│ - Manages filter/sort/pagination state              │
│ - Renders UI layout                                 │
│ - Handles user interactions                         │
└─────────────────────────────────────────────────────┘
        ↓              ↓              ↓
   ┌────────┐  ┌──────────┐  ┌─────────────┐
   │ Filters│  │   Sort   │  │  Pagination │
   └────┬───┘  └────┬─────┘  └──────┬──────┘
        └───────────┼────────────────┘
                    ↓
        When user changes filters/sort/page
                    ↓
    Server Action: fetchProperties(newFilters)
                    ↓
    Returns PropertyListResponse
                    ↓
    Update state and re-render grid
```

---

## 📱 Responsive Design

### Desktop (1024px+)
- Sidebar filters on left
- Main content grid on right
- Horizontal sort bar
- Full pagination

### Tablet (768px-1023px)
- Filters in modal
- Main content grid
- Horizontal sort bar
- Full pagination

### Mobile (<768px)
- Filter modal button
- Stacked sort bar
- Vertical grid (1-2 columns)
- Responsive pagination

---

## ⚡ Performance Optimizations

### 1. ISR (Incremental Static Regeneration)
```typescript
export const revalidate = 3600; // Revalidate every 1 hour
```

### 2. Dynamic Static Params
```typescript
export async function generateStaticParams() {
  const slugs = await getAllLocationSlugs();
  return slugs.map(slug => ({ slug }));
}
```

### 3. Image Optimization
```typescript
<Image
  src={property.image}
  alt={property.title}
  width={400}
  height={300}
  className="object-cover"
/>
```

### 4. Code Splitting
```typescript
// Filters component only loaded when needed
const PropertyFilters = dynamic(() => 
  import('@/components/filters/PropertyFilters')
);
```

---

## 🧪 Usage Examples

### Example 1: Location Page

```typescript
// /location/[slug]/page.tsx
export default async function LocationPage({ params }) {
  const location = await getLocationBySlug(params.slug);
  const initialData = await fetchLocationProperties(location.id, {
    limit: 12,
    offset: 0,
  });

  return (
    <PropertyListingTemplate
      initialData={initialData}
      onFetchProperties={(filters) =>
        fetchLocationProperties(location.id, filters)
      }
      title={`Properties in ${location.name}`}
      subtitle={`Find your perfect home in ${location.name}`}
      heroComponent={<LocationHero location={location} />}
      showFilters={true}
      contextFilters={{ locationId: location.id }}
    />
  );
}
```

### Example 2: Developer Page

```typescript
// /developer/[slug]/page.tsx
export default async function DeveloperPage({ params }) {
  const developer = await getDeveloperBySlug(params.slug);
  const initialData = await fetchDeveloperProperties(developer.id);

  return (
    <PropertyListingTemplate
      initialData={initialData}
      onFetchProperties={(filters) =>
        fetchDeveloperProperties(developer.id, filters)
      }
      title={`${developer.name} Projects`}
      heroComponent={<DeveloperHero developer={developer} />}
      contextFilters={{ developerId: developer.id }}
      itemsPerPage={12}
    />
  );
}
```

### Example 3: Luxury Properties (No Filters)

```typescript
// /luxury-properties/page.tsx
export default async function LuxuryPropertiesPage() {
  const initialData = await fetchProperties({
    priceMin: 250000000, // ₹2.5Cr+
    limit: 12,
  });

  return (
    <PropertyListingTemplate
      initialData={initialData}
      onFetchProperties={(filters) =>
        fetchProperties({
          ...filters,
          priceMin: 250000000, // Always filter by price
        })
      }
      title="Luxury Properties"
      subtitle="Premium properties above ₹2.5 Crore"
      showFilters={false} // No additional filters needed
      contextFilters={{ priceMin: 250000000 }}
    />
  );
}
```

### Example 4: Affordable Properties with Custom Sorting

```typescript
// /affordable/page.tsx
export default async function AffordablePropertiesPage() {
  const customSortOptions = [
    { value: 'newest', label: 'Latest Launches' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'availability', label: 'Ready to Move' },
  ];

  const initialData = await fetchProperties({
    propertyType: 'residential',
    priceMax: 50000000, // ₹50L
    limit: 12,
  });

  return (
    <PropertyListingTemplate
      initialData={initialData}
      onFetchProperties={(filters) =>
        fetchProperties({
          ...filters,
          propertyType: 'residential',
          priceMax: 50000000,
        })
      }
      title="Affordable Residential Properties"
      sortOptions={customSortOptions}
      contextFilters={{
        propertyType: 'residential',
        priceMax: 50000000,
      }}
    />
  );
}
```

---

## 🔐 Security Considerations

1. **Input Validation**: All filter values validated on server
2. **SQL Injection Prevention**: Query parameters sanitized by API
3. **CORS Protection**: Requests only to own backend
4. **Rate Limiting**: Implement on backend to prevent abuse
5. **Data Sanitization**: HTML escaped in all user-facing content

---

## 🚀 Deployment Checklist

- [ ] All API endpoints tested and working
- [ ] Static param generation works for all locations/developers
- [ ] ISR revalidation configured
- [ ] Mobile responsive design tested
- [ ] Filter/sort/pagination functionality verified
- [ ] Error states handled properly
- [ ] Loading states show correctly
- [ ] Images optimized and loading
- [ ] Metadata generated correctly
- [ ] Breadcrumbs working
- [ ] Analytics tracking added
- [ ] Lighthouse performance score >90

---

## 📈 Analytics Integration

```typescript
// Track filter changes
const handleFilterChange = (newFilters) => {
  gtag.event('filter_applied', {
    filter_type: Object.keys(newFilters)[0],
    filter_value: Object.values(newFilters)[0],
  });
  setFilters(newFilters);
};

// Track sort changes
const handleSortChange = (sort) => {
  gtag.event('sort_applied', {
    sort_by: sort,
  });
};

// Track pagination
const handlePageChange = (page) => {
  gtag.event('pagination', {
    page_number: page,
  });
};
```

---

## 🐛 Troubleshooting

### Properties not loading
- Check API endpoint: `/properties`
- Verify filters are correct format
- Check network tab for errors
- Verify backend is running

### Filters not working
- Check `onFetchProperties` is implemented
- Verify filter values are being passed
- Check backend supports filter parameters
- Check context filters are not overriding user filters

### Pagination not showing
- Check `totalPages > 1`
- Verify pagination component is rendered
- Check page numbers calculate correctly

### Images not showing
- Check image URLs are valid
- Verify image hosting is accessible
- Check Next.js Image component configuration

---

## 📚 Further Customization

### Add Search Functionality
```typescript
// Add search to PropertyFilters
<input
  type="text"
  placeholder="Search properties..."
  onChange={(e) => handleSearch(e.target.value)}
/>
```

### Add Map View
```typescript
// Add map view tab
<Tabs>
  <TabContent value="grid">
    {/* Grid view */}
  </TabContent>
  <TabContent value="map">
    <PropertyMap properties={data.data} />
  </TabContent>
</Tabs>
```

### Add Property Comparison
```typescript
// Allow selecting multiple properties
const [selectedProperties, setSelectedProperties] = useState([]);
// Add compare button when properties are selected
```

---

**Last Updated:** January 31, 2026
**Version:** 1.0.0
**Status:** Production Ready
