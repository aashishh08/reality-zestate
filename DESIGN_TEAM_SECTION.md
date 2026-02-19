# Design & Construction Team Section

## Overview
Added a new "Design & Construction Team" section below the Location section showcasing the architects, landscape designers, and construction partners behind the project. Matches the Kimi app design with color-coded team member cards and a dark highlights section.

## Component Architecture

### File Structure
```
frontend/
├── components/project/
│   └── ProjectTeam.tsx           # New component
├── app/projects/[slug]/
│   └── page.tsx                  # Updated with ProjectTeam
├── types/
│   └── index.ts                  # Added team interface
└── lib/
    ├── data.ts                   # Added sample team data
    └── property-transformer.ts   # Added default team data
```

## Component Features

### 1. Team Members Grid (3-Column Layout)
```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ [BLUE HEADER]           │ [GREEN HEADER]          │ [ORANGE HEADER]         │
│ 🏢 ARCHITECT            │ 🎨 LANDSCAPE DESIGN     │ 🏗️  CONSTRUCTION        │
│ Hafeez Contractor       │ Paul Friedberg & Co     │ DLF Home Developers     │
│                         │                         │                         │
│ [White Content Card]    │ [White Content Card]    │ [White Content Card]    │
│ Description...          │ Description...          │ Description...          │
│                         │                         │                         │
│ KEY ACHIEVEMENTS        │ KEY ACHIEVEMENTS        │ KEY ACHIEVEMENTS        │
│ • Achievement 1         │ • Achievement 1         │ • Achievement 1         │
│ • Achievement 2         │ • Achievement 2         │ • Achievement 2         │
│ • Achievement 3         │ • Achievement 3         │ • Achievement 3         │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

### 2. Color-Coded Cards
- **Architect**: Blue (#3B82F6)
- **Landscape Design**: Green (#10B981)
- **Construction**: Orange (#F97316)

### 3. Card Structure
Each team member card has:
- **Header Card** (Colored background)
  - Role label (uppercase, small)
  - Name (serif font, bold)
  - Icon
  
- **Content Card** (White background)
  - Description text
  - Key Achievements list with color-coded bullets

### 4. Highlights Section (Bottom)
Dark gradient background (dark navy to black) with 3 centered highlight boxes:
- **Global Expertise**: International design standards
- **Proven Track Record**: 100+ million sq.ft. delivered
- **Award Winning**: Multiple industry accolades

## Data Structure

```typescript
interface ProjectTeamProps {
  team?: {
    members: {
      role: string;              // "Architect", "Landscape Design", "Construction"
      name: string;              // Person/Company name
      color: string;             // Hex color for header (#3B82F6, #10B981, #F97316)
      description: string;       // 2-3 sentences about expertise
      achievements: string[];    // 3 key achievements
    }[];
    highlights?: {
      title: string;            // "Global Expertise"
      subtitle: string;         // "International design standards"
      icon?: string;            // Optional icon identifier
    }[];
  };
}
```

## Sample Data

```typescript
team: {
  members: [
    {
      role: "Architect",
      name: "Hafeez Contractor",
      color: "#3B82F6",
      description: "India's most celebrated architect with over 40 years of experience...",
      achievements: [
        "Designed 100+ million sq.ft. of real estate",
        "Recipient of multiple architectural excellence awards",
        "Known for sustainable and innovative designs"
      ]
    },
    {
      role: "Landscape Design",
      name: "Paul Friedberg & Partners",
      color: "#10B981",
      description: "Internationally acclaimed landscape architecture firm based in New York...",
      achievements: [
        "50+ years of landscape design excellence",
        "Projects across 30+ countries",
        "Focus on sustainable and native landscaping"
      ]
    },
    {
      role: "Construction",
      name: "DLF Home Developers",
      color: "#F97316",
      description: "The construction arm of DLF Limited, responsible for delivering...",
      achievements: [
        "75+ years of construction expertise",
        "25+ million sq.ft. delivered annually",
        "ISO 9001:2015 certified processes"
      ]
    }
  ],
  highlights: [
    {
      title: "Global Expertise",
      subtitle: "International design standards"
    },
    {
      title: "Proven Track Record",
      subtitle: "100+ million sq.ft. delivered"
    },
    {
      title: "Award Winning",
      subtitle: "Multiple industry accolades"
    }
  ]
}
```

## Animation Behavior

- **Header**: "THE VISIONARIES" label fades in
- **Section Heading**: Uses SectionHeading component with gold accent line
- **Team Cards**: Stagger in from bottom (0.1s delay per card)
- **Achievements**: List items stagger in (0.05s delay per item)
- **Highlights Section**: Slides up with 0.2s delay after cards
- **Highlight Items**: Stagger in (0.1s delay per item)

## Styling Details

### Color Scheme
- Primary Gold: #C9A961
- Dark Backgrounds: #1F2937 to #111827 (gradient)
- Text Colors: White, Gray 600, Gray 400
- Icon Colors: Vary by category

### Responsive Behavior
- **Mobile**: 1 column team cards, 1 column highlights
- **Tablet**: 2 column team cards, cards adjust
- **Desktop**: 3 column team cards, 3 column highlights

### Hover Effects
- Team cards: Shadow increase, smooth transition
- Highlights: Subtle icon scale effect

## Best Practices Implemented

✅ **Clean Code**
- Reusable component structure
- Clear prop interfaces
- Type-safe TypeScript implementation

✅ **Consistent Patterns**
- Uses SectionHeading component (gold accent line)
- Follows established color scheme
- Matches animation patterns from other sections
- Uses Framer Motion for animations

✅ **Accessibility**
- Semantic HTML structure
- Proper color contrast
- Readable font sizes
- Clear information hierarchy

✅ **Performance**
- Conditional rendering (if no team data, section not rendered)
- Optimized animations with `whileInView`
- No unnecessary re-renders

✅ **Maintainability**
- Single source of truth for data
- Easy to add more team members
- Icon mapping system for flexibility
- Default data in transformer for backend properties

## Optional Fields

- `team` in details is optional
- If not provided or empty, section won't render
- Backward compatible with existing project data
- Default team data provided for backend properties

## Files Modified

1. **ProjectTeam.tsx** (NEW)
   - Complete team section component
   - Color-coded member cards
   - Dark highlights section

2. **types/index.ts**
   - Added `team` interface to details

3. **lib/data.ts**
   - Added sample team data for Grand Arch project

4. **lib/property-transformer.ts**
   - Added default team data for backend properties
   - Ensures all properties have team information

5. **app/projects/[slug]/page.tsx**
   - Imported ProjectTeam component
   - Added ProjectTeam between Location and Specifications sections

## Section Placement
```
Page Flow:
Hero → Intro → Gallery → Overview → Booking CTA → 
Why Invest → Amenities → Floor Plans → Location → 
TEAM (NEW) → Specifications → Payment Plans → USP → FAQ → Similar
```

## Future Enhancements

- Add team member photos/avatars
- Add clickable links to company websites
- Add social media links
- Add more detailed bios/case studies
- Add certification logos
- Add testimonials from past projects
- Add awards/certification images

## Testing Checklist

- [ ] Verify 3 team member cards display on desktop
- [ ] Check 1 column layout on mobile
- [ ] Verify hover effects work smoothly
- [ ] Check color-coded headers display correctly
- [ ] Ensure achievements list items animate in sequence
- [ ] Verify highlights section displays below cards
- [ ] Check dark gradient background renders correctly
- [ ] Verify all icons are visible
- [ ] Test responsive behavior on tablets
- [ ] Confirm section hides if no team data provided

