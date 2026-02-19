# FAQ Fallback - Ensuring FAQs Always Display

## Issue
FAQs were not showing on some project pages even though fallback data was in the transformer.

## Root Cause
The page-level conditional was too strict:
```tsx
// OLD - Would skip FAQs if not explicitly set
{details?.faqs && (
  <ProjectFAQ faqs={details.faqs} />
)}
```

This didn't account for cases where:
1. Backend property didn't have FAQs in PropertySections
2. Transformer might not initialize FAQs properly
3. Details object structure was different

## Solution
Added a multi-level fallback at the page level:

```tsx
// NEW - Always show FAQs with fallback
{details && details.faqs && details.faqs.length > 0 ? (
  <ProjectFAQ faqs={details.faqs} />
) : details ? (
  <ProjectFAQ faqs={defaultFAQs} />
) : null}
```

## Default FAQs Provided

If no FAQs are found, the page now displays 4 default FAQs:

### 1. General
- **Q:** "What is the project about?"
- **A:** "This is a premium residential development featuring ultra-luxury apartments with world-class amenities and strategic location."

### 2. Units
- **Q:** "What are the available unit configurations?"
- **A:** "We offer multiple configurations ranging from 2 BHK to 4+ BHK units, each designed with premium finishes and modern amenities."

### 3. Payment
- **Q:** "What are the payment options?"
- **A:** "We provide flexible payment plans including construction-linked, down payment, and progressive payment options to suit your needs."

### 4. Possession
- **Q:** "When is the possession timeline?"
- **A:** "The project is planned for possession within the specified timeline. Contact our sales team for detailed information."

## Data Flow

```
Backend Property
    ↓
getPropertyBySlug()
    ↓
transformBackendPropertyToProject()
    ↓
buildDetailsFromSections()
    ↓
faqsData.faqs || [4 default FAQs]
    ↓
project.details.faqs
    ↓
Page Component
    ↓
(Hardcoded FAQs) OR (Transformer FAQs) OR (Fallback FAQs)
    ↓
ProjectFAQ Component
```

## Fallback Hierarchy

1. **Hardcoded Data** (Grand Arch, etc.)
   - 12 detailed FAQs with categories
   - Custom project-specific answers

2. **Backend Data** (Mahindra Origins, etc.)
   - FAQs from PropertySections
   - If available, use these

3. **Transformer Defaults**
   - 4 generic FAQs with categories
   - Generic but informative answers

4. **Page-Level Fallback** (Safety net)
   - Same 4 generic FAQs
   - Ensures FAQs always render

## Benefits

✅ **Always Shows FAQs** - No blank sections
✅ **Multiple Fallbacks** - Handles all data scenarios
✅ **Category Support** - All fallback FAQs have categories
✅ **Consistent UX** - Same elegant design regardless of source
✅ **Clean Implementation** - No error handling needed in FAQ component

## Files Modified

1. **app/projects/[slug]/page.tsx**
   - Enhanced conditional rendering
   - Added page-level FAQ fallback
   - Maintains clean code structure

## Testing

Test on different project types:

1. **Hardcoded Project** (The Grand Arch)
   ```
   http://localhost:3001/projects/the-grand-arch-gurgaon
   ```
   Expected: 12 detailed FAQs visible

2. **Backend Project** (Mahindra Origins)
   ```
   http://localhost:3001/projects/mahindra-origins-pune
   ```
   Expected: FAQs visible (backend or fallback)

3. **Any Project**
   - Scroll to FAQ section
   - Should always be present
   - Should have category tabs
   - Should be interactive

## Verification Checklist

- [ ] FAQ section visible on hardcoded projects
- [ ] FAQ section visible on backend projects
- [ ] Category tabs appear
- [ ] Accordion items clickable
- [ ] Animations smooth
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Fallback FAQs show when needed

## Future Improvements

- Allow backends to provide custom FAQs
- Add FAQ management API endpoint
- Enable dynamic FAQ updates
- Add FAQ analytics tracking
- Support more FAQ categories

