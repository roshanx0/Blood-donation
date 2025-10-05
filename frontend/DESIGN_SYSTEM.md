# Design System Quick Reference

## 🎨 Color Palette

### Primary Colors

```css
Red Primary: #dc2626 (red-600)
Red Dark: #b91c1c (red-700)
Red Darker: #991b1b (red-800)
```

### Text Colors

```css
Primary Text: #1f2937 (gray-900)
Secondary Text: #4b5563 (gray-600)
Tertiary Text: #6b7280 (gray-500)
Placeholder: #9ca3af (gray-400)
```

### Background Colors

```css
White: #ffffff
Gray 50: #f9fafb
Gray 100: #f3f4f6
Red 50: #fef2f2
Red 100: #fee2e2
```

### Border Colors

```css
Light: #f3f4f6 (gray-100)
Medium: #e5e7eb (gray-200)
Accent: #fecaca (red-200)
```

---

## 📏 Spacing Scale

### Icon Spacing

- **Icon-to-Text**: `space-x-2.5` (10px)
- **Icon Padding**: `p-2.5` to `p-4` (10px to 16px)
- **Icon Container**: `w-14 h-14` or `w-12 h-12`

### Input Field Icons

- **Icon Container**: `pl-3.5` (14px from left)
- **Input Padding**: `pl-11` (44px to clear icon)
- **Icon Size**: `h-5 w-5` (20px)

### Card Spacing

- **Card Padding**: `p-6` to `p-8` (24px to 32px)
- **Card Gap**: `gap-6` (24px)

### Section Spacing

- **Vertical Padding**: `py-12` to `py-20` (48px to 80px)
- **Container Margins**: `mb-6` to `mb-8` (24px to 32px)

---

## 🔲 Border Radius

```css
Small: rounded-lg (8px)
Medium: rounded-xl (12px)
Large: rounded-2xl (16px)
Extra Large: rounded-3xl (24px)
```

### Usage

- **Buttons**: `rounded-lg` to `rounded-xl`
- **Cards**: `rounded-xl` to `rounded-2xl`
- **Icons**: `rounded-xl` to `rounded-2xl`
- **Hero CTA**: `rounded-3xl`

---

## 🌟 Shadows

```css
Subtle: shadow-sm
Default: shadow-md
Prominent: shadow-lg
Hero: shadow-xl
```

### Hover States

```css
shadow-sm → shadow-md (cards, buttons)
shadow-md → shadow-lg (prominent buttons)
```

---

## 📝 Typography

### Font Family

```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", ...;
```

### Font Sizes

```css
Small: text-sm (14px)
Base: text-base (16px)
Large: text-lg (18px)
XL: text-xl (20px)
2XL: text-2xl (24px)
3XL: text-3xl (30px)
4XL: text-4xl (36px)
```

### Font Weights

```css
Regular: font-normal (400)
Medium: font-medium (500)
Semibold: font-semibold (600)
Bold: font-bold (700)
```

### Usage

- **Headings**: `text-3xl font-bold`
- **Subheadings**: `text-xl font-semibold`
- **Body**: `text-base font-normal`
- **Labels**: `text-sm font-semibold`
- **Captions**: `text-sm font-medium`

---

## 🎭 Gradients

### Primary Gradient

```css
bg-gradient-to-r from-red-600 to-red-700
bg-gradient-to-br from-red-600 to-red-700
```

### Background Gradient

```css
bg-gradient-to-br from-red-50 via-white to-gray-50
```

### Card Gradient

```css
bg-gradient-to-br from-white via-red-50/30 to-red-50/50
```

### Icon Container Gradient

```css
bg-gradient-to-br from-red-600 to-red-700
bg-gradient-to-br from-red-50 to-red-100
```

---

## 🔘 Buttons

### Primary Button

```jsx
className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700
           text-white rounded-lg font-semibold shadow-md
           hover:from-red-700 hover:to-red-800 hover:shadow-lg
           transition-all focus:ring-2 focus:ring-red-500
           focus:ring-offset-2"
```

### Secondary Button

```jsx
className="px-6 py-3 bg-white text-red-600 border-2
           border-red-600 rounded-lg font-semibold
           hover:bg-red-50 transition-all focus:ring-2
           focus:ring-red-500 focus:ring-offset-2"
```

---

## 📝 Forms

### Label

```jsx
className = "block text-sm font-semibold text-gray-800 mb-2";
```

### Input Field

```jsx
className="w-full px-4 py-3 border border-gray-300 rounded-lg
           focus:ring-2 focus:ring-red-500 focus:border-red-500
           transition-all outline-none placeholder-gray-400
           text-gray-900 bg-white"
```

### Input with Icon

```jsx
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
    <Icon className="h-5 w-5 text-gray-400" />
  </div>
  <input className="input-field pl-11" />
</div>
```

---

## 🃏 Cards

### Basic Card

```jsx
className="bg-white rounded-xl shadow-sm border
           border-gray-100 p-6 transition-all"
```

### Gradient Card

```jsx
className="bg-gradient-to-br from-white via-red-50/30
           to-red-50/50 rounded-xl shadow-sm p-6
           border border-red-100 transition-all"
```

### Hover Card

```jsx
className="card transition-all hover:-translate-y-1
           hover:shadow-md hover:border-red-200"
```

---

## 🎯 Icons

### Icon Container (Primary)

```jsx
className="bg-gradient-to-br from-red-600 to-red-700
           p-4 rounded-2xl shadow-md"
```

### Icon Container (Secondary)

```jsx
className="bg-gradient-to-br from-red-50 to-red-100
           p-3 rounded-xl shadow-sm"
```

### Icon Size

```css
Form Icons: h-5 w-5
Button Icons: h-5 w-5
Large Icons: h-8 w-8
Hero Icons: h-12 w-12
```

---

## 🎬 Animations

### Transitions

```css
transition-all duration-300
transition-colors duration-300
```

### Hover Transforms

```css
hover:-translate-y-0.5  /* Subtle lift */
hover:-translate-y-1    /* Medium lift */
hover:scale-105         /* Slight grow */
hover:scale-110         /* More grow */
```

### Animation Classes

```css
animate-slide-up
animate-fade-in
animate-pulse
```

---

## ♿ Accessibility

### Focus States

```css
focus:outline-none
focus:ring-2
focus:ring-red-500
focus:ring-offset-2
```

### Contrast Requirements

- **Body text on white**: gray-600 or darker ✅
- **Labels**: gray-800 or darker ✅
- **Headings**: gray-900 ✅
- **Links**: red-600 with underline on focus ✅

---

## 📱 Responsive Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Common Patterns

```jsx
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";
className = "text-3xl lg:text-4xl";
className = "py-12 lg:py-20";
```

---

## 🎨 Usage Examples

### Page Header

```jsx
<div className="text-center mb-8">
  <div className="flex justify-center mb-5">
    <div
      className="bg-gradient-to-br from-red-600 to-red-700 
                    p-4 rounded-2xl shadow-md"
    >
      <Icon className="h-12 w-12 text-white" />
    </div>
  </div>
  <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Title</h1>
  <p className="text-gray-600 text-sm">Subtitle text</p>
</div>
```

### Stats Card

```jsx
<Card gradient className="text-center">
  <div className="flex justify-center mb-3">
    <div
      className="bg-gradient-to-br from-red-600 to-red-700 
                    p-3 rounded-xl shadow-sm"
    >
      <Icon className="h-6 w-6 text-white" />
    </div>
  </div>
  <div className="text-3xl font-bold text-gray-900 mb-1">1,234</div>
  <div className="text-sm text-gray-600 font-medium">Label</div>
</Card>
```

---

_Keep this reference handy for consistent styling across all components!_
