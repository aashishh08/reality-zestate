# Opulnz Abode - Luxury Real Estate Platform

A premium real estate website built with Next.js 14, featuring dynamic project pages with ISR (Incremental Static Regeneration) for optimal performance and SEO.

## 🏗️ Architecture

### Dynamic Project System

The platform uses a **data-driven architecture** where all projects are defined in `lib/data.ts`. This allows for:

- **Dynamic Routing**: Each project automatically gets its own page at `/projects/[slug]`
- **ISR (Incremental Static Regeneration)**: Pages are statically generated and revalidated every hour
- **SEO Optimization**: Dynamic metadata generation for each project
- **Conditional Rendering**: Sections only render if data is provided

### Adding New Projects

To add a new project, simply add an entry to the `projects` array in `lib/data.ts`:

```typescript
{
  id: "10",
  slug: "your-project-slug", // URL-friendly identifier
  title: "Your Project Name",
  location: "Location, City",
  price: "₹ X Cr Onwards",
  image: "/images/your-project.jpg",
  category: "Trending", // or "Upcoming", "Boutique", "Exclusive"
  type: "Property Type",
  details: {
    heroImage: "/images/hero.jpg",
    subtitle: "Tagline for the project",
    highlights: {
      landArea: "X Acres",
      possession: "Month Year",
      rera: "RERA Number",
      configuration: "3, 4 & 5 BHK",
      priceRange: "₹ X Cr - ₹ Y Cr"
    },
    overview: {
      heading: "Main Heading",
      content: ["Paragraph 1", "Paragraph 2"],
      features: ["Feature 1", "Feature 2"]
    },
    amenities: [
      { name: "Swimming Pool", icon: "🏊" }
    ],
    floorPlans: [
      {
        type: "3 BHK",
        superArea: "2200 sq.ft",
        price: "₹ 4.5 Cr",
        image: "/images/floor-plan.jpg"
      }
    ],
    location: {
      nearby: [
        {
          category: "Schools",
          items: [
            { name: "School Name", distance: "2 km" }
          ]
        }
      ]
    },
    usp: ["USP 1", "USP 2"],
    faqs: [
      {
        question: "Question?",
        answer: "Answer"
      }
    ]
  }
}
```

The project will automatically:
- Appear in the appropriate category section (Trending/Upcoming/Boutique)
- Get its own detail page at `/projects/your-project-slug`
- Be indexed for SEO with proper metadata
- Be statically generated at build time

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
└── data.ts                   # Central data source for all projects

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

1. **Data Definition** (`lib/data.ts`)
   - Projects are defined with all details
   - Helper functions for data retrieval

2. **Static Generation** (Build Time)
   - `generateStaticParams()` creates routes for all projects
   - `generateMetadata()` creates SEO tags
   - Pages are pre-rendered as static HTML

3. **ISR** (Runtime)
   - Pages are served from cache
   - Revalidated every hour in background
   - New data appears without rebuild

4. **Conditional Rendering**
   - Sections check for data existence
   - Only render if data is provided
   - Graceful degradation for incomplete data

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
