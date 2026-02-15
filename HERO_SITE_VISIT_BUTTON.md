# Hero Section - Schedule Site Visit Button

## 📋 Overview

Added a "Schedule Site Visit" button in the hero section alongside the "Download Brochure" button. Clicking it opens a modal form to capture visitor details.

---

## ✅ Changes Made

### **File Modified:** `ProjectHero.tsx`

**Key Updates:**

1. **Added State Management**
   - `useState` hook to control form modal visibility

2. **Added Calendar Icon**
   - Imported `Calendar` from `lucide-react`

3. **Two-Button Layout**
   - Primary: "Schedule Site Visit" (gold gradient)
   - Secondary: "Download Brochure" (transparent with white border)

4. **Modal Form**
   - Clean form with 4 fields: Name, Email, Phone, Preferred Date
   - Animated entrance with Framer Motion
   - Close button in top-right
   - Gold focus rings on inputs
   - Responsive design

---

## 🎨 Visual Layout

**Hero Section Buttons:**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Property Title]                               │
│  [Subtitle]                                     │
│  📍 Location                                     │
│                                                 │
│  ┌──────────────────────┐  ┌──────────────────┐│
│  │ 📅 Schedule Site     │  │ ⬇ Download       ││
│  │    Visit (Primary)   │  │   Brochure       ││
│  └──────────────────────┘  └──────────────────┘│
└─────────────────────────────────────────────────┘
```

**Button Styles:**

- **Schedule Site Visit:**
  - Gold gradient background
  - White text
  - Calendar icon
  - Hover: lift up effect + shadow

- **Download Brochure:**
  - Transparent with white border
  - Backdrop blur effect
  - White text
  - Hover: solid white background + dark text

---

## 📝 Form Fields

**Modal Form Includes:**

1. **Your Name** (required)
   - Text input
   - Placeholder: "Enter your name"

2. **Email Address** (required)
   - Email input
   - Placeholder: "Enter your email"

3. **Phone Number** (required)
   - Tel input
   - Placeholder: "10-digit mobile number"

4. **Preferred Date** (optional)
   - Date picker
   - Allows user to select visit date

5. **Submit Button**
   - Text: "Book Site Visit"
   - Gold gradient background

---

## 🔧 Technical Implementation

**Component Structure:**

```tsx
export function ProjectHero({ project }: ProjectHeroProps) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <>
      {/* Hero Section */}
      <section>
        {/* ... hero content ... */}
        <button onClick={() => setShowForm(true)}>
          Schedule Site Visit
        </button>
      </section>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm">
          <motion.div>
            {/* Form content */}
          </motion.div>
        </div>
      )}
    </>
  );
}
```

**Animations:**
- Modal entrance: Scale from 0.9 to 1.0
- Button hover: Translate up
- Calendar icon: Scale on hover
- Download icon: Bounce animation

---

## 🎯 User Flow

1. User lands on property page
2. Hero section shows two CTAs
3. User clicks "Schedule Site Visit"
4. Modal form appears with backdrop blur
5. User fills in details (name, email, phone, date)
6. User submits form
7. Form data captured (ready for API integration)

---

## 💡 Next Steps (Optional Enhancements)

**Backend Integration:**
- Connect form to leads API
- Add form validation
- Show success/error messages
- Auto-close modal on success

**Features to Add:**
- Time slot selection
- Visit type (virtual/physical)
- Loading state while submitting
- Form validation errors

**Current State:**
- ✅ Clean UI/UX
- ✅ Responsive design  
- ✅ Smooth animations
- ⏳ Ready for API integration

---

## 📱 Responsive Behavior

**Desktop:**
- Two buttons side by side
- Full-width modal (max-width: 448px)

**Mobile:**
- Buttons stacked vertically
- Full-screen modal with padding
- Optimized input sizes

---

## ✨ Design Features

✅ **Dual CTA Design** - Primary + Secondary action  
✅ **Modal Form** - Clean overlay with backdrop blur  
✅ **Smooth Animations** - Framer Motion transitions  
✅ **Accessible** - Proper labels and aria attributes  
✅ **Responsive** - Works on all screen sizes  
✅ **Premium Look** - Gold accents, clean typography

---

**Files Modified:** 1 file  
**Lines Added:** ~100 lines  
**Dependencies:** No new dependencies (uses existing Framer Motion)

**Status:** ✅ Complete and ready to use
