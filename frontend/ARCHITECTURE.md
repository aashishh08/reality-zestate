# Frontend Architecture - API Integration & Error Handling

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND APPLICATION                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PRESENTATION LAYER (UI)                     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌─────────────────────┐  ┌──────────────────────────┐ │  │
│  │  │  LeadForm.tsx       │  │  LeadPopup.tsx           │ │  │
│  │  │  (Component)        │  │  (Component)             │ │  │
│  │  └──────────┬──────────┘  └────────────┬─────────────┘ │  │
│  │             │                          │               │  │
│  │             └──────────────┬───────────┘               │  │
│  │                            │                          │  │
│  └────────────────────────────┼──────────────────────────┘  │
│                               │                             │
│  ┌────────────────────────────┼──────────────────────────┐  │
│  │         BUSINESS LOGIC LAYER                        │  │
│  ├────────────────────────────┼──────────────────────────┤  │
│  │                            │                         │  │
│  │  ┌────────────────────────▼──────────────────────┐  │  │
│  │  │  useApiCall Hook                              │  │  │
│  │  │  - Loading State Management                   │  │  │
│  │  │  - Error State & Messages                     │  │  │
│  │  │  - Automatic Retry (Exponential Backoff)      │  │  │
│  │  │  - Success Callbacks                          │  │  │
│  │  └────────────┬─────────────────────────────────┘  │  │
│  │               │                                     │  │
│  │  ┌────────────┴──────────────────────────────────┐  │  │
│  │  │  validateLeadForm / validateField             │  │  │
│  │  │  - Field Validation                           │  │  │
│  │  │  - Error Message Generation                   │  │  │
│  │  │  - Type-Safe Validation                       │  │  │
│  │  └────────────┬─────────────────────────────────┘  │  │
│  │               │                                     │  │
│  │  ┌────────────┴──────────────────────────────────┐  │  │
│  │  │  ErrorBoundary                                │  │  │
│  │  │  - React Error Catching                       │  │  │
│  │  │  - Fallback UI Rendering                      │  │  │
│  │  │  - Error Recovery Options                     │  │  │
│  │  └────────────┬─────────────────────────────────┘  │  │
│  │               │                                     │  │
│  └───────────────┼─────────────────────────────────────┘  │
│                  │                                        │
│  ┌───────────────┼─────────────────────────────────────┐  │
│  │      API CLIENT LAYER                             │  │
│  ├───────────────┼─────────────────────────────────────┤  │
│  │               │                                    │  │
│  │  ┌────────────▼──────────────────────────────────┐ │  │
│  │  │  API Constants                                │ │  │
│  │  │  - Request Timeout: 30s                       │ │  │
│  │  │  - Retry Attempts: 3                          │ │  │
│  │  │  - Retry Delay: 1s (exponential)              │ │  │
│  │  │  - Error Messages                             │ │  │
│  │  │  - Validation Rules                           │ │  │
│  │  └────────────┬─────────────────────────────────┘ │  │
│  │               │                                    │  │
│  │  ┌────────────┴──────────────────────────────────┐ │  │
│  │  │  fetchFromAPI (api-client.ts)                │ │  │
│  │  │  - HTTP Request/Response                      │ │  │
│  │  │  - Error Handling                             │ │  │
│  │  │  - Timeout Management                         │ │  │
│  │  │  - Header Construction                        │ │  │
│  │  └────────────┬─────────────────────────────────┘ │  │
│  │               │                                    │  │
│  └───────────────┼────────────────────────────────────┘  │
│                  │                                       │
│                  │ HTTP REQUEST                          │
└──────────────────┼───────────────────────────────────────┘
                   │
                   │ POST /api/v1/leads
                   │ Content-Type: application/json
                   │ Body: { name, email, phone, source, propertyId }
                   │
                   ▼
┌──────────────────────────────────────┐
│      BACKEND API SERVER              │
├──────────────────────────────────────┤
│  POST /leads                         │
│  ├── Validate Input                  │
│  ├── Check for Duplicates            │
│  ├── Save to Database                │
│  └── Return Lead ID                  │
└──────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### Happy Path (Success)

```
User Input
   │
   ├─► Field Validation (Real-time)
   │   - Show error if invalid
   │   - Enable/disable submit button
   │
   ├─► User Clicks Submit
   │
   ├─► Form Validation
   │   - Validate all fields
   │   - Show errors if invalid
   │
   ├─► API Call (useApiCall)
   │   ├─► POST to /api/v1/leads
   │   │   └─► Loading State
   │   │
   │   ├─► Backend Processes
   │   │
   │   └─► Response Received
   │       ├─► Success: Lead Created ✅
   │       │   └─► Show Success Message
   │       │       └─► Auto-close after 3s
   │       │           └─► Form Reset
   │       │
   │       └─► Error: Retry Logic ❌
   │           └─► Exponential Backoff
   │               ├─► Retry #1 (1s)
   │               ├─► Retry #2 (2s)
   │               ├─► Retry #3 (4s)
   │               └─► If all fail
   │                   └─► Show Error Message
   │                       └─► User Can Retry
```

### Error Scenarios

```
Network Error (Failed to fetch)
   └─► Retryable ✅
       └─► Auto-retry with backoff
           └─► If still fails: Show error + retry button

Timeout Error (Request took >30s)
   └─► Retryable ✅
       └─► Auto-retry with backoff
           └─► If still fails: Show timeout message

Server Error (5xx status)
   └─► Retryable ✅
       └─► Auto-retry with backoff
           └─► If still fails: Show server error

Client Error (4xx status)
   └─► NOT Retryable ❌
       └─► Show specific error message
           └─► User can fix and retry

Component Error (Runtime exception)
   └─► Caught by Error Boundary
       └─► Show fallback UI
           └─► Offer recovery button
```

---

## 🔄 State Management Flow

### useApiCall Hook State Machine

```
┌─────────────────────────────────────────────────────────┐
│                    IDLE STATE                           │
│  loading: false, error: null, data: null               │
└────────────────────┬──────────────────────────────────┘
                     │
                     │ execute(apiCall)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  LOADING STATE                         │
│  loading: true, error: null, data: null               │
│  ├─► Pending API call                                  │
│  └─► Request timeout: 30s                              │
└────────┬──────────────────────────────┬────────────────┘
         │                              │
         │ Success                      │ Error
         ▼                              ▼
┌────────────────────┐    ┌────────────────────────────────┐
│  SUCCESS STATE     │    │      ERROR STATE               │
│  loading: false    │    │  loading: false                │
│  error: null       │    │  error: "Message"              │
│  data: <response>  │    │  isRetrying: true/false        │
│                    │    │                                │
│  ├─► Optional:     │    │  Is error retryable?          │
│  │   onSuccess()   │    │  └─► retryCount < MAX?        │
│  │                 │    │      ├─► YES: Schedule retry  │
│  │   └─► User can  │    │      │   └─► exponential     │
│  │       call      │    │      │       backoff          │
│  │       reset()   │    │      └─► Loop back to IDLE   │
│  │                 │    │                               │
│  └─► Can retry     │    │      ├─► NO: Stay in error   │
│      with          │    │      │   ├─► Show message    │
│      retryLast     │    │      │   └─► Optional:      │
│      Call()        │    │      │       onError()       │
└────────────────────┘    │                               │
                          │      ├─► User can:           │
                          │      │   - Fix input          │
                          │      │   - Click retry        │
                          │      │   - Try again later    │
                          └──────────────────────────────┘
```

---

## 🗂️ Component Hierarchy

```
App/Layout
│
├─► ErrorBoundary (Global)
│   │
│   ├─► Page Components
│   │   ├─► LeadForm (Category Page)
│   │   │   ├─► Form Input Fields
│   │   │   ├─► Validation Messages
│   │   │   ├─► Loading Spinner
│   │   │   ├─► Error Message
│   │   │   └─► Success Message
│   │   │
│   │   └─► LeadPopup (All Pages)
│   │       ├─► Modal Backdrop
│   │       ├─► Form Section
│   │       │   ├─► Input Fields
│   │       │   ├─► Error Message
│   │       │   └─► Success Message
│   │       └─► Close Button
│   │
│   └─► SectionErrorBoundary (Optional)
│       └─► Expensive Components
│
└─► Footer / Other UI
```

---

## 📡 API Request/Response Flow

### Request Structure

```typescript
POST /api/v1/leads HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token> (if authenticated)
User-Agent: Next.js/16.1.1

{
  "name": "John Doe",              // ✅ Required, 2-100 chars
  "email": "john@example.com",     // ✅ Required, valid email
  "phone": "9999999999",           // ✅ Required, 10 digits
  "source": "lead-form",           // ✅ Optional, for tracking
  "propertyId": "prop-123"         // ✅ Optional, property-specific
}
```

### Response Structure (Success)

```typescript
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "lead-abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9999999999",
    "status": "new",
    "source": "lead-form",
    "propertyId": "prop-123",
    "createdAt": "2026-01-31T10:30:00Z",
    "updatedAt": "2026-01-31T10:30:00Z"
  }
}
```

### Response Structure (Error)

```typescript
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email already exists"],
    "phone": ["Invalid phone format"]
  }
}
```

---

## 🔐 Error Handling Flow

```
API Call Fails
   │
   ├─► Parse Error Type
   │   ├─► Network Error?
   │   │   └─► getMessage(): "Network connection error"
   │   │       └─► Retryable: YES
   │   │
   │   ├─► Timeout Error?
   │   │   └─► getMessage(): "Request timeout"
   │   │       └─► Retryable: YES (if < MAX_RETRIES)
   │   │
   │   ├─► Status 5xx?
   │   │   └─► getMessage(): From response.message
   │   │       └─► Retryable: YES (if < MAX_RETRIES)
   │   │
   │   ├─► Status 4xx?
   │   │   └─► getMessage(): From response.message
   │   │       └─► Retryable: NO
   │   │
   │   └─► Unknown Error?
   │       └─► getMessage(): error.message
   │           └─► Retryable: NO
   │
   ├─► Is Retryable?
   │   │
   │   ├─► YES:
   │   │   ├─► Check retry count
   │   │   │   ├─► < MAX_RETRIES (3)?
   │   │   │   │   ├─► Set isRetrying: true
   │   │   │   │   ├─► Calculate backoff delay
   │   │   │   │   ├─► Wait (exponential)
   │   │   │   │   └─► Retry API call
   │   │   │   │
   │   │   │   └─► >= MAX_RETRIES?
   │   │   │       └─► Fall through to NOT retryable
   │   │   │
   │   │   └─► Update UI: isRetrying = true
   │   │
   │   └─► NO:
   │       ├─► Set error state
   │       ├─► Display error message
   │       ├─► Call onError callback
   │       ├─► Return null from execute()
   │       └─► Allow manual retry
```

---

## 📋 Validation Flow

```
User Enters Text in Field
   │
   ├─► onChange Event Triggered
   │
   ├─► validateField(fieldName, value)
   │   │
   │   ├─► Name Field?
   │   │   ├─► Check: not empty
   │   │   ├─► Check: length >= 2
   │   │   ├─► Check: length <= 100
   │   │   └─► Return: error message or null
   │   │
   │   ├─► Email Field?
   │   │   ├─► Check: not empty
   │   │   ├─► Check: regex match
   │   │   └─► Return: error message or null
   │   │
   │   └─► Phone Field?
   │       ├─► Check: not empty
   │       ├─► Check: exactly 10 digits
   │       └─► Return: error message or null
   │
   ├─► Update fieldErrors state
   │   ├─► Show error if present
   │   ├─► Red border on input
   │   └─► Disable submit if any error
   │
   └─► User Sees Feedback Immediately
```

---

## 🎯 Component Responsibilities

### LeadForm Component
**Responsibilities:**
- Render form UI
- Manage form state
- Handle user input
- Call validation
- Trigger API calls
- Display errors
- Show success state

**Dependencies:**
- createLead (API)
- useApiCall (Hook)
- validateLeadForm, validateField (Validation)
- Constants (Config)

### useApiCall Hook
**Responsibilities:**
- Manage loading state
- Manage error state
- Handle retry logic
- Call API function
- Parse errors
- Trigger callbacks

**Dependencies:**
- Constants (Config)
- Error handling utilities

### Validation Module
**Responsibilities:**
- Validate field input
- Generate error messages
- Check constraints
- Return validation result

**Dependencies:**
- Constants (Validation rules)

### ErrorBoundary Component
**Responsibilities:**
- Catch React errors
- Render fallback UI
- Log errors
- Provide recovery button

**Dependencies:**
- Icons (Lucide)
- CSS classes

### Constants Module
**Responsibilities:**
- Provide configuration
- Export validation rules
- Export error messages
- Export UI settings

**Dependencies:**
- None (pure data)

---

## 🔄 Integration Points

### 1. Components ↔️ API
```typescript
LeadForm/LeadPopup
     │
     ├─► import createLead from lib/api/leads
     │
     └─► call createLead(formData)
         │
         └─► fetchFromAPI<Lead> in api-client.ts
             │
             └─► HTTP POST to backend
```

### 2. Components ↔️ Hooks
```typescript
LeadForm/LeadPopup
     │
     ├─► import useApiCall from lib/hooks
     │
     └─► const { execute, loading, error } = useApiCall()
         │
         └─► await execute(() => createLead(...))
```

### 3. Components ↔️ Validation
```typescript
LeadForm/LeadPopup
     │
     ├─► import validateLeadForm, validateField
     │
     ├─► validateField(name, value) on change
     │
     └─► validateLeadForm(formData) on submit
```

### 4. App ↔️ ErrorBoundary
```typescript
App/Layout
     │
     ├─► import ErrorBoundary
     │
     └─► <ErrorBoundary>
             <YourApp />
         </ErrorBoundary>
```

---

## 📊 Type Flow

```
Form Data
   │ Input: { name, email, phone }
   │
   ├─► validateLeadForm()
   │   └─► Output: ValidationResult { isValid: bool, errors: {} }
   │
   ├─► createLead()
   │   │ Input: { name, email, phone, source?, propertyId? }
   │   │
   │   └─► fetchFromAPI<Lead>()
   │       │ Input: endpoint, options
   │       │
   │       ├─► HTTP Request
   │       │
   │       └─► Output: Lead { id, name, email, phone, ... }
   │
   ├─► useApiCall Hook
   │   └─► Manages: UseApiCallState<T>
   │       { data: T, loading: bool, error: string, isRetrying: bool }
   │
   └─► Component State
       └─► Display based on state
```

---

## ⚡ Performance Optimizations

```
Input → Field Validation
   │
   ├─► Real-time, no debounce needed
   │   (Simple regex checks)
   │
   └─► Fast feedback < 10ms

Form Submit → API Call
   │
   ├─► useApiCall manages request
   │
   ├─► Timeout: 30 seconds (configurable)
   │
   ├─► Retry logic:
   │   ├─► Exponential backoff (1s, 2s, 4s)
   │   └─► Prevents server overload
   │
   └─► Smart error retry
       └─► Only on retryable errors

Rendering
   │
   ├─► No unnecessary re-renders
   │
   ├─► Animations: GPU-accelerated
   │   └─► 60fps with Framer Motion
   │
   └─► Bundle: ~5KB gzipped increase
```

---

## 🔍 Debugging Points

### Logs to Watch
```typescript
// API Client Logs
[API] Fetching: POST /api/v1/leads
[API] Response: POST /api/v1/leads -> 201
[API] Success: POST /api/v1/leads

// Error Logs
[API] Error: POST /api/v1/leads - Network error
```

### State Inspection
```typescript
// Console in component
console.log(loading);    // Is API call in progress?
console.log(error);      // Error message if any
console.log(data);       // Response data
console.log(fieldErrors); // Validation errors per field
```

### Network Inspection (DevTools)
```
1. Open Network tab
2. Submit form
3. Look for POST request to /api/v1/leads
4. Check:
   - Request headers
   - Request body (form data)
   - Response status (201 success, 4xx/5xx error)
   - Response body (error details)
```

---

## 🧪 Testing Strategy

```
Unit Tests
   ├─► validateLeadForm() with valid/invalid data
   ├─► validateField() for each field
   └─► Constants structure and values

Component Tests
   ├─► LeadForm renders correctly
   ├─► LeadForm submission works
   ├─► Error handling displays message
   └─► Success message shows and closes

Hook Tests
   ├─► useApiCall state transitions
   ├─► Retry logic with backoff
   ├─► Error callback firing
   └─► Success callback firing

Integration Tests
   ├─► Full form submission flow
   ├─► Error recovery flow
   ├─► Retry flow
   └─► Success confirmation flow
```

---

## 📝 Summary

**Architecture Type:** Layered Architecture
- Presentation Layer (Components)
- Business Logic Layer (Hooks, Validation)
- API Client Layer (API communication)
- Configuration Layer (Constants)

**Error Handling:** Multi-level
- Component level (try/catch in handlers)
- Hook level (useApiCall state)
- Boundary level (ErrorBoundary)
- API level (error messages)

**Data Flow:** Unidirectional
- User Input → Validation → API Call → State Update → UI Render

**State Management:** Local Component State
- No global state needed currently
- Hooks manage async operation state
- Props pass data down, callbacks up

---

This architecture provides:
✅ Clear separation of concerns
✅ Easy to test and maintain
✅ Scalable for future features
✅ Production-ready error handling
✅ Optimal performance
