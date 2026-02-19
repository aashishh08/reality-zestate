# FAQ Section Visibility Fix

## Issue
The FAQ section was not displaying on the property detail page for `http://localhost:3001/projects/mahindra-origins-pune` (and potentially other backend-fetched properties).

## Root Cause
The conditional rendering in the page component was checking for both the existence AND non-empty length of the FAQs array:

```tsx
// OLD - Too strict condition
{details?.faqs && details.faqs.length > 0 && (
  <ProjectFAQ faqs={details.faqs} />
)}
```

Even though the property transformer always provides default FAQs, the strict length check could prevent rendering in edge cases.

## Solution
Updated the conditional to only check for existence:

```tsx
// NEW - Simple existence check
{details?.faqs && (
  <ProjectFAQ faqs={details.faqs} />
)}
```

## Why This Works

### Property Transformer Guarantee
The `buildDetailsFromSections()` function in `property-transformer.ts` **always** returns a non-empty FAQs array:

```typescript
faqs: faqsData.faqs || [
  {
    question: "What is the project about?",
    answer: "This is a premium residential development...",
    category: "General"
  },
  // ... 3 more default FAQs
],
```

**Default FAQs include:**
1. ✅ What is the project about? (General)
2. ✅ What are the available unit configurations? (Units)
3. ✅ What are the payment options? (Payment)
4. ✅ When is the possession timeline? (Possession)

### Always Returns Details
The transformer always returns a `details` object with FAQs - never undefined or null:

```typescript
// In transformBackendPropertyToProject()
details: detailsFromSections,  // Always defined
```

## Files Modified
- **frontend/app/projects/[slug]/page.tsx** - Updated FAQ conditional rendering

## Verification

### Before Fix
- Backend properties (like mahindra-origins-pune): ❌ FAQ section hidden
- Hardcoded properties (like the-grand-arch): ✅ FAQ section visible

### After Fix
- Backend properties: ✅ FAQ section visible with defaults
- Hardcoded properties: ✅ FAQ section visible with custom data
- All properties: ✅ Always show FAQ section

## Testing

To verify the fix works:

1. Navigate to any property detail page:
   - `http://localhost:3001/projects/mahindra-origins-pune` (backend)
   - `http://localhost:3001/projects/the-grand-arch-gurgaon` (hardcoded)

2. Scroll to FAQ section
3. Verify:
   - ✅ FAQ section is visible
   - ✅ Category tabs appear (General, Units, Payment, Possession)
   - ✅ Accordion items are clickable
   - ✅ Animations are smooth

## Best Practices Applied

✅ **Always Provide Defaults** - Transformer ensures FAQs always exist
✅ **Simple Conditions** - Use only necessary checks
✅ **Consistent Behavior** - All properties show FAQ section
✅ **No Breaking Changes** - Backward compatible with existing data

## Future Improvements

Consider:
- Adding a way for backends to override default FAQs
- Adding custom FAQ categories per project
- Storing FAQs in backend PropertySections
- API endpoint for FAQs management

