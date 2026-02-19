# FAQ Section Redesign - Kimi App Style

## Overview
Completely redesigned the FAQ section to match the Kimi app's elegant design with category tabs, improved accordion styling, and better visual hierarchy.

## Key Features

### 1. Header Section
```
GOT QUESTIONS? (gold label, uppercase, small)

Frequently Asked Questions (large serif heading with gold accent line)

Descriptive subtitle
```

### 2. Category Tabs (NEW)
- Dynamically generated from FAQ categories
- Gold background for active tab
- Gray background for inactive tabs
- Smooth hover transitions
- Auto-reset to first question when switching categories

Example categories:
- General
- Units
- Payment
- Possession

### 3. Improved Accordion Design

**Each FAQ item includes:**
```
┌─────────────────────────────────────────────┐
│ [?] Question Text                      ✓ ▼ │
├─────────────────────────────────────────────┤
│ Answer text appears here when expanded      │
└─────────────────────────────────────────────┘
```

**Visual Elements:**
- Gold question mark icon in circular background
- Serif font for questions (bold, dark)
- Gray text for answers
- Gold chevron that rotates on expand
- Hover border color change (gray to gold)
- Smooth open/close animations

### 4. Visual Improvements
- Rounded corners (lg) instead of sharp edges
- Better spacing and padding
- Gold accent color throughout
- Smooth transitions (300ms)
- Responsive design for all screen sizes

## Data Structure

### FAQ Interface
```typescript
interface FAQ {
  question: string;       // Question text
  answer: string;         // Answer text
  category?: string;      // Category name (General, Units, Payment, Possession)
}
```

### Sample Data
```typescript
faqs: [
  {
    question: "What is DLF The Dahlias?",
    answer: "DLF The Dahlias is an ultra-luxury residential development...",
    category: "General"
  },
  {
    question: "How many towers and units are there?",
    answer: "The project features 7 residential towers...",
    category: "Units"
  },
  // ... more FAQs
]
```

## Component Features

### Tab Functionality
- Extracts unique categories from FAQ data
- Groups FAQs by category
- Switches between categories on tab click
- Resets open FAQ to first item when changing categories

### Accordion Features
- One item can be open at a time
- Smooth height animation (0.3s)
- Staggered entrance animations
- Chevron icon rotates on expand/collapse
- Border hover effect

### Animations
- Header elements: Fade-in on scroll
- Category tabs: Fade-in with delay
- FAQ items: Stagger in (0.05s delay per item)
- Open/Close: Height animation (0.3s duration)
- Smooth transitions: 200-300ms for all interactions

## Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Primary Gold | Gold | #C9A961 |
| Dark Text | Dark Brown | #2C2416 |
| Light Background | White | #FFFFFF |
| Hover Border | Gold | #C9A961 |
| Inactive Tab | Light Gray | #F3F4F6 |
| Answer Text | Gray | #4B5563 |

## Responsive Behavior

- **Mobile**: Single column, full-width tabs, smaller padding
- **Tablet**: Adjusted spacing, flexwrap for tabs
- **Desktop**: Full layout with proper max-width (4xl)

## File Structure

```
frontend/
├── components/project/
│   └── ProjectFAQ.tsx              # Updated component
├── types/
│   └── index.ts                    # Added category field
└── lib/
    ├── data.ts                     # Updated sample FAQs with categories
    └── property-transformer.ts     # Updated default FAQs with categories
```

## Changes Made

### ProjectFAQ.tsx
- Added category tab system
- Improved accordion styling with gold accents
- Added ? icon to question headers
- Enhanced animations
- Added responsive padding and spacing
- Better visual hierarchy

### types/index.ts
- Added `category?: string` to FAQ interface

### lib/data.ts
- Updated all 12 FAQs with categories
- Expanded answer text with more detailed information
- Added sample categories: General, Units, Payment, Possession

### lib/property-transformer.ts
- Added 4 default FAQs with categories for backend properties
- Ensures all properties have FAQ data

## Sample FAQ Categories

### General
- What is the project?
- Where is it located?
- Total land area?
- Key amenities?

### Units
- How many towers and units?
- Available configurations?
- Super built-up areas?

### Payment
- What payment plans are available?
- Down payment options?
- Price range?

### Possession
- Possession timeline?
- RERA registration?

## Styling Details

### Tab Styling
```css
Active Tab:
- Background: #C9A961
- Text: White
- Shadow: md

Inactive Tab:
- Background: #F3F4F6
- Text: #4B5563
- Hover: #E5E7EB
```

### Accordion Styling
```css
Border: 1px solid #E5E7EB
Hover Border: 1px solid #C9A961
Rounded: lg (8px)
Padding: 1.5rem
```

## Best Practices Implemented

✅ **Clean Code**
- Clear state management
- Reusable component structure
- Type-safe TypeScript

✅ **Consistent Patterns**
- Uses SectionHeading component
- Follows gold accent color scheme
- Matches animations from other sections
- Framer Motion animations

✅ **Accessibility**
- Proper semantic HTML
- Clear question numbering with icons
- Good color contrast
- Keyboard accessible buttons

✅ **Performance**
- Conditional rendering for tabs (only if multiple categories)
- Optimized animations with whileInView
- No unnecessary re-renders

✅ **User Experience**
- Clear category organization
- Easy to scan FAQs
- Smooth animations
- Responsive on all devices

## Optional Fields

- `category` field is optional
- FAQs without category default to "General"
- Single category FAQs still render without tabs
- Backward compatible with existing FAQ data

## Future Enhancements

- Add search/filter functionality
- Add most popular FAQs highlight
- Add expand all/collapse all buttons
- Add FAQ impressions tracking
- Add contact button in FAQ section
- Add FAQ rating/helpful feedback
- Add anchor links to specific FAQs
- Add print-friendly FAQ view

## Testing Checklist

- [ ] Verify tabs appear for multiple categories
- [ ] Verify tab switching works correctly
- [ ] Check that FAQs reset when switching tabs
- [ ] Verify accordion open/close works smoothly
- [ ] Check hover effects on tabs and FAQ items
- [ ] Verify icons display correctly
- [ ] Test responsive behavior on mobile/tablet
- [ ] Verify animations are smooth (60fps)
- [ ] Check that chevron rotates correctly
- [ ] Verify single category FAQs render without tabs
- [ ] Test keyboard navigation
- [ ] Check accessibility contrast ratios

