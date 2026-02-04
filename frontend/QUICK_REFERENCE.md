# Quick Reference - API Integration & Error Handling

## 🚀 Quick Start (30 seconds)

### Using LeadForm
```typescript
import { LeadForm } from "@/components/category/LeadForm";

export default function Page() {
  return <LeadForm source="my-page" />;
}
```

### Using LeadPopup
```typescript
import { LeadPopup } from "@/components/ui/LeadPopup";

export default function Page() {
  return <LeadPopup source="my-page" />;
}
```

### Using Custom Hook
```typescript
import { useApiCall } from "@/lib/hooks/useApiCall";
import { createLead } from "@/lib/api/leads";

const { execute, loading, error } = useApiCall();
await execute(() => createLead(formData));
```

---

## 📁 File Location Reference

| What | Location |
|------|----------|
| Lead Form Component | `components/category/LeadForm.tsx` |
| Lead Popup Component | `components/ui/LeadPopup.tsx` |
| API Hook | `lib/hooks/useApiCall.ts` |
| Form Validation | `lib/validation/lead-form.ts` |
| Configuration | `lib/constants.ts` |
| Error Boundary | `components/ErrorBoundary.tsx` |
| Full Guide | `API_INTEGRATION_GUIDE.md` |
| Implementation Details | `IMPLEMENTATION_SUMMARY.md` |

---

## ⚙️ Configuration

```typescript
// lib/constants.ts - Customize here

// API behavior
API_CONFIG.RETRY_ATTEMPTS        // How many retries
API_CONFIG.REQUEST_TIMEOUT       // Request timeout (ms)
API_CONFIG.RETRY_DELAY           // Delay between retries (ms)

// Form behavior
FORM_CONFIG.LEAD_POPUP_DELAY     // When to show popup (ms)
FORM_CONFIG.SUCCESS_DISPLAY_TIME // Success message duration (ms)
FORM_CONFIG.SUBMIT_DELAY         // Loading delay (ms)

// Validation rules
LEAD_FORM_VALIDATION.PHONE_REGEX // Update phone format
LEAD_FORM_VALIDATION.EMAIL_REGEX // Update email format
```

---

## 🎯 Key Features

| Feature | Where | How |
|---------|-------|-----|
| Real API Calls | LeadForm.tsx, LeadPopup.tsx | Uses `createLead()` from `lib/api/leads.ts` |
| Auto Retry | useApiCall hook | Automatic on network/timeout/5xx errors |
| Validation | validateLeadForm function | Real-time + on submit |
| Error Handling | useApiCall hook + ErrorBoundary | Try/catch + React Error Boundary |
| User Messages | ERROR_MESSAGES constant | Customizable, user-friendly |
| Loading State | useApiCall hook | Shows spinner, disables button |
| Success State | Components | Shows success message, auto-closes |

---

## 🔧 Props Reference

### LeadForm Props
```typescript
<LeadForm
  offerTitle="Your Title"              // Optional
  offerValidTill="Date"                // Optional
  source="category-page"               // Optional - for tracking
  propertyId="prop-123"                // Optional - property-specific lead
/>
```

### LeadPopup Props
```typescript
<LeadPopup
  source="home-page"                   // Optional - for tracking
/>
```

### useApiCall Options
```typescript
const { execute, loading, error, data, reset, retryLastCall } = useApiCall({
  onSuccess: (data) => {},             // Optional callback
  onError: (error) => {},              // Optional callback
  retryCount: 3,                       // Optional override
  timeout: 30000,                      // Optional timeout
});
```

---

## 🛠️ Common Tasks

### Validate Form
```typescript
import { validateLeadForm } from "@/lib/validation/lead-form";

const validation = validateLeadForm(formData);
if (!validation.isValid) {
  console.log(validation.errors); // { name: "Name is required", ... }
}
```

### Make API Call
```typescript
import { createLead } from "@/lib/api/leads";

try {
  const lead = await createLead({
    name: "John Doe",
    email: "john@example.com",
    phone: "9999999999",
    source: "website",
    propertyId: "prop-123",
  });
  console.log("Lead created:", lead);
} catch (error) {
  console.error("Failed:", error.message);
}
```

### Handle Errors
```typescript
import { getErrorMessage } from "@/lib/api-client";

try {
  // API call
} catch (error) {
  const message = getErrorMessage(error);
  console.log(message); // User-friendly message
}
```

### Add Error Boundary
```typescript
import { SectionErrorBoundary } from "@/components/ErrorBoundary";

<SectionErrorBoundary>
  <MyComponent />
</SectionErrorBoundary>
```

---

## 🧪 Testing

### Test Validation
```typescript
import { validateLeadForm, validateField } from "@/lib/validation/lead-form";

// Form validation
const result = validateLeadForm(data);
expect(result.isValid).toBe(true/false);

// Field validation
const error = validateField("email", "test@example.com");
expect(error).toBeNull();
```

### Test Hook
```typescript
import { renderHook, act } from "@testing-library/react";
import { useApiCall } from "@/lib/hooks/useApiCall";

const { result } = renderHook(() => useApiCall());

await act(async () => {
  await result.current.execute(() => Promise.resolve("data"));
});

expect(result.current.data).toBe("data");
```

---

## 🐛 Debugging

### Check What's Happening
1. Open DevTools (F12)
2. Go to Console tab
3. Submit form
4. Look for `[API]` log messages
5. Check Network tab for API calls

### Common Issues

| Issue | Solution |
|-------|----------|
| Form not submitting | Check console for errors, verify API running |
| Error showing | Click retry button or refresh page |
| No API call | Check validation, network tab |
| Infinite retry | Check RETRY_ATTEMPTS in constants |
| Form won't validate | Check LEAD_FORM_VALIDATION rules |

---

## 📊 Error Messages

| Error | When | Solution |
|-------|------|----------|
| Network Connection Error | Can't reach API | Check API server is running |
| Request Timeout | API too slow | Increase REQUEST_TIMEOUT in constants |
| Backend Server Error | Server returned 5xx | Wait and try again (auto-retries) |
| Validation Error | Invalid input | Check error message, fix input |

---

## 🚨 Production Checklist

Before deploying to production:

- [ ] Set `NEXT_PUBLIC_API_URL` environment variable
- [ ] Test with real API backend
- [ ] Test error scenarios (offline, slow network)
- [ ] Add error tracking (optional: Sentry)
- [ ] Add analytics (optional: GA, Mixpanel)
- [ ] Review constants for correct values
- [ ] Test on mobile devices
- [ ] Test error boundary recovery
- [ ] Check accessibility (keyboard, screen reader)

---

## 🔗 Related Files

- Backend API: `../backend/api/leads.ts`
- Types: `lib/api/leads.ts` (Lead interface)
- API Client: `lib/api-client.ts`
- Full Docs: `API_INTEGRATION_GUIDE.md`

---

## 💡 Tips & Tricks

**Tip 1: Custom Error Messages**
```typescript
// In lib/constants.ts
export const ERROR_MESSAGES = {
  // Add custom messages
  LEAD_ALREADY_EXISTS: "This email is already registered.",
};
```

**Tip 2: Debug Mode**
```typescript
// In components, add to see all requests:
console.log(loading, error, data);
```

**Tip 3: Test Offline**
```typescript
// DevTools > Network > Offline > Submit form
// Should see network error, auto-retry
```

**Tip 4: Test Slow Network**
```typescript
// DevTools > Network > Slow 3G > Submit form
// Should see timeout if > REQUEST_TIMEOUT
```

---

## 📞 Need Help?

1. **Check code comments** - Most files have JSDoc comments
2. **Read API_INTEGRATION_GUIDE.md** - Comprehensive guide
3. **Check test examples** - Shows how to use
4. **Console logs** - Check `[API]` messages
5. **Browser DevTools** - Check Network, Console tabs

---

## ✨ What You Get

✅ Real API integration (no more simulated calls)
✅ Automatic retry with exponential backoff
✅ Real-time form validation
✅ User-friendly error messages
✅ Error boundaries for crash prevention
✅ Loading states and feedback
✅ Success animations
✅ Type-safe TypeScript code
✅ Zero linter errors
✅ Production ready

---

## 🎉 You're All Set!

Your lead forms now have:
- Real API integration
- Comprehensive error handling
- Form validation
- Retry logic
- Beautiful UX

Start using them today! 🚀
