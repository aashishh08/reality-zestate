# Implementation Guide: Section Heading Styles

## How It Works

### Before (Old Approach)
```tsx
// Multiple different implementations across components
<motion.div className="text-center mb-16">
  <motion.h2 className="text-4xl font-serif font-bold text-black mb-4">
    Investment Analysis
  </motion.h2>
  <p className="text-zinc-600">Description...</p>
</motion.div>

// Different styling for different sections
<h2 className="text-3xl font-serif text-[#2C2416] mb-6">
  Project Gallery
</h2>
```

### After (New Approach)
```tsx
// Consistent implementation everywhere
<SectionHeading>Investment Analysis</SectionHeading>

// For left-aligned sections
<SectionHeading centered={false}>Project Gallery</SectionHeading>
```

## Visual Design

```
┌─────────────────────────────────────┐
│                                     │
│    ════════════════════  (Gold line │
│    slides in on scroll)             │
│                                     │
│    Investment Analysis              │ ← Serif heading
│    (Playfair Display)               │
│                                     │
└─────────────────────────────────────┘
```

## Component Props

```typescript
interface SectionHeadingProps {
  children: React.ReactNode;        // The heading text
  centered?: boolean;               // Center or left-align (default: true)
  className?: string;               // Additional Tailwind classes
}
```

## Usage Examples

### Centered Heading (Default)
```tsx
<SectionHeading>World-Class Amenities</SectionHeading>
```

### Left-Aligned Heading
```tsx
<SectionHeading centered={false}>Project Gallery</SectionHeading>
```

### With Custom Classes
```tsx
<SectionHeading className="mb-8">
  Master <span className="text-gold-dark">Floor Plans</span>
</SectionHeading>
```

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Gold Line (Start) | Gold | #C9A961 |
| Gold Line (End) | Gold Dark | #D4AF7C |
| Heading Text | Dark Brown | #2C2416 |
| Background | Varies | — |

## Animation Timeline

```
0ms     → 300ms      : Gold line slides in (width: 0 → 80px)
100ms   → 600ms      : Heading fades and slides in (opacity & y-axis)

Total Duration: ~600ms
```

## Integration Checklist

When updating a new component, follow these steps:

1. **Import the component**
   ```tsx
   import { SectionHeading } from "@/components/ui/SectionHeading";
   ```

2. **Replace old heading markup**
   ```tsx
   // Remove:
   <motion.div className="text-center mb-16">
     <motion.h2 className="...">Your Title</motion.h2>
   </motion.div>
   
   // Replace with:
   <SectionHeading>Your Title</SectionHeading>
   ```

3. **Update alignment if needed**
   ```tsx
   <SectionHeading centered={false}>Gallery</SectionHeading>
   ```

4. **Keep description/subtitle outside** (if any)
   ```tsx
   <SectionHeading>Your Title</SectionHeading>
   <p className="text-gray-600">Optional description</p>
   ```

## Troubleshooting

**Gold line not showing?**
- Ensure Framer Motion is installed
- Check that viewport detection is enabled in Framer Motion config

**Text not centered?**
- Verify `centered={true}` (default) or add it explicitly
- Check parent container margins aren't conflicting

**Animation too fast/slow?**
- Modify `transition={{ duration: 0.6 }}` in SectionHeading.tsx
- Adjust `delay: 0.1` for heading animation timing

## Performance Notes

- Component uses `whileInView` for performance (only animates when visible)
- No impact on page load time
- Smooth 60fps animations with GPU acceleration

## Accessibility

- Uses semantic `<h2>` tag (change to `<h1>` if needed in SectionHeading.tsx)
- Maintains proper heading hierarchy
- Gold line is purely decorative (CSS-based)
- Text remains readable with sufficient contrast

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

