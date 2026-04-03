# Opulnz Abode - Luxury Real Estate Platform

A premium real estate website built with Next.js 14, featuring dynamic project pages with ISR (Incremental Static Regeneration) for optimal performance and SEO.

## 🏗️ Architecture

### Dynamic Project System

Published properties come from the **backend API** (`lib/api/properties.ts`). Detail pages at `/projects/[slug]` load CMS-backed sections only—there is no static project catalog in the frontend.

- **Dynamic Routing**: Each published property slug gets a page at `/projects/[slug]` (`dynamicParams` allows new slugs without a rebuild).
- **SEO**: `generateMetadata` and Open Graph use real hero/thumbnail URLs when the API provides them.
- **Conditional Rendering**: Sections render only when the API returns the matching property sections.

### Adding New Projects

Create and publish the property in the admin CMS (or API). Listings, detail pages, and metadata use that data end to end.

## 🚀 Performance Features

### ISR Configuration
- **Revalidation**: 1 hour (3600 seconds)
- **Build Time**: All project pages are pre-rendered
- **Runtime**: Pages are served statically and revalidated in the background

### SEO Optimization
- Dynamic meta tags per project
- Open Graph tags for social sharing
- Semantic HTML structure
- Optimized images with Next.js Image component

## 📁 Project Structure

```
app/
├── projects/
│   └── [slug]/
│       ├── page.tsx          # Dynamic project detail page
│       └── not-found.tsx     # Custom 404 page
├── page.tsx                  # Homepage
└── layout.tsx                # Root layout with SEO metadata

components/
├── home/                     # Homepage sections
│   ├── TrendingProjects.tsx
│   ├── UpcomingProjects.tsx
│   ├── BoutiqueCollection.tsx
│   └── OpulnzExclusive.tsx
├── project/                  # Project detail page sections
│   ├── ProjectHero.tsx
│   ├── ProjectHighlights.tsx
│   ├── ProjectOverview.tsx
│   ├── ProjectAmenities.tsx
│   ├── ProjectFloorPlans.tsx
│   ├── ProjectLocation.tsx
│   ├── ProjectUSP.tsx
│   └── ProjectFAQ.tsx
├── layout/                   # Global layout components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Footer.tsx
│   └── FloatingActions.tsx
└── ui/                       # Reusable UI components
    ├── PropertyCard.tsx
    └── LeadPopup.tsx

lib/
└── api/                      # API clients (properties, categories, etc.)

types/
└── index.ts                  # TypeScript interfaces
```

## 🎨 Design System

### Colors
- **Gold**: `#D4AF37` (Primary accent)
- **Black**: `#000000` (Dark sections)
- **White**: `#FFFFFF` (Light sections)
- **Zinc**: Various shades for UI elements

### Typography
- **Serif**: Playfair Display (Headings, luxury feel)
- **Sans**: Montserrat (Body text, UI elements)

### Animations
- Framer Motion for smooth transitions
- Scroll-triggered animations
- Hover effects on interactive elements

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Data Flow

1. **API** — Properties, categories, tags, and sections are stored in the backend and exposed via REST.
2. **Detail pages** — `getPropertyBySlug` plus `transformBackendPropertyToProject` map API payloads to UI types.
3. **`generateStaticParams`** — Optionally pre-renders paths for published slugs when the API is reachable at build time; otherwise routes are still served dynamically.
4. **Conditional rendering** — UI sections appear only when the corresponding CMS sections exist.

## 🔍 SEO Best Practices

- ✅ Dynamic meta tags per page
- ✅ Semantic HTML structure
- ✅ Open Graph tags
- ✅ Optimized images
- ✅ Fast page loads (ISR)
- ✅ Mobile responsive
- ✅ Structured data ready

## 📝 Notes

- All project images should be placed in `public/images/`
- Slugs must be unique and URL-friendly
- ISR revalidation can be adjusted in `app/projects/[slug]/page.tsx`
- The system supports partial data - sections won't render if data is missing
