# Tailwind CSS Quick Reference Guide

## PatientAgent Frontend Tailwind Patterns

This guide provides common Tailwind CSS patterns used throughout the PatientAgent project.

---

## Layout Patterns

### Full Screen Container
```jsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
  <div className="max-w-6xl mx-auto">
    {/* Content */}
  </div>
</div>
```

### Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {/* Items */}
</div>
```

### Card Layout
```jsx
<div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
  {/* Card content */}
</div>
```

---

## Color & Styling Patterns

### Gradient Backgrounds
```jsx
// Directional gradient
<div className="bg-gradient-to-br from-blue-600 to-indigo-600">

// Right gradient
<div className="bg-gradient-to-r from-red-600 to-red-700">

// Linear gradient
<div className="bg-gradient-to-b from-slate-50 to-slate-100">
```

### Color-Coded Badges
```jsx
// Risk levels
const getRiskColor = (level) => {
  if (level === 'HIGH') return 'bg-red-100 text-red-800 border-red-300';
  if (level === 'MEDIUM') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  return 'bg-green-100 text-green-800 border-green-300';
};

<span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(level)}`}>
  {level}
</span>
```

### Dark Theme Pattern
```jsx
<div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white border border-slate-600">
  <h2 className="text-white">Title</h2>
  <p className="text-slate-300">Subtitle</p>
  <button className="bg-blue-600 hover:bg-blue-700 text-white">Action</button>
</div>
```

---

## Component Patterns

### Stat Card
```jsx
<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
  <div className="flex justify-between items-center mb-4">
    <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center text-blue-700">
      📊
    </div>
    <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
      +5%
    </span>
  </div>
  <h3 className="text-gray-600 text-sm font-medium mb-1">Total Patients</h3>
  <p className="text-3xl font-bold text-blue-700">245</p>
</div>
```

### Alert/Message Box
```jsx
// Error
<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
  <p className="text-red-700 text-sm font-semibold">❌ Error message</p>
</div>

// Success
<div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
  <p className="text-green-700 text-sm font-semibold">✓ Success message</p>
</div>

// Warning
<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
  <p className="text-yellow-700 text-sm font-semibold">⚠️ Warning message</p>
</div>
```

### Button Styles
```jsx
// Primary Button
<button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition">
  Click Me
</button>

// Secondary Button
<button className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
  Secondary
</button>

// Danger Button
<button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
  Delete
</button>

// Loading Button
<button disabled className="opacity-50 cursor-not-allowed">
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  Loading...
</button>
```

### Form Input
```jsx
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Username
  </label>
  <input
    type="text"
    placeholder="Enter username"
    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition bg-gray-50"
  />
</div>
```

### Table Structure
```jsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="bg-slate-50 border-b border-gray-200">
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Header</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4 font-semibold text-gray-900">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Navigation Item
```jsx
<Link
  to="/path"
  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
>
  Dashboard
</Link>
```

---

## Interactive Elements

### Hover Effects
```jsx
// Shadow
className="hover:shadow-lg transition-shadow"

// Color change
className="hover:text-blue-600 transition-colors"

// Scale
className="hover:scale-105 transition transform"

// Background
className="hover:bg-blue-50 transition-colors"

// Border
className="hover:border-blue-500 transition-colors"
```

### Loading Spinner
```jsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
```

### Mobile Menu (Close Icon)
```jsx
{mobileMenuOpen ? (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
) : (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
)}
```

---

## Responsive Patterns

### Mobile-First Breakpoints
```jsx
// Mobile by default, then adjust
className="px-4 md:px-8 lg:px-12"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="hidden md:block"  // Hidden on mobile, visible on tablet+
className="md:hidden"         // Visible on mobile, hidden on tablet+
```

### Responsive Text
```jsx
<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
  Title
</h1>
```

### Responsive Spacing
```jsx
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>
```

---

## Accessibility Patterns

### Semantic HTML
```jsx
<nav className="bg-white shadow-md">
  <div className="max-w-6xl mx-auto">
    <h1 className="text-2xl font-bold">Logo</h1>
  </div>
</nav>

<main className="min-h-screen bg-gray-50">
  {/* Main content */}
</main>
```

### Focus States
```jsx
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Clickable
</button>

<input className="focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200" />
```

---

## Common Color Combinations

### Blue Theme
```jsx
<div className="bg-gradient-to-br from-blue-50 to-indigo-100">
  <div className="border-l-4 border-blue-500"></div>
  <span className="bg-blue-100 text-blue-800">Badge</span>
</div>
```

### Red/Alert Theme
```jsx
<div className="bg-red-50 border border-red-200">
  <span className="bg-red-100 text-red-800">Alert</span>
  <button className="bg-red-600 hover:bg-red-700 text-white">Action</button>
</div>
```

### Dark Theme
```jsx
<div className="bg-slate-900">
  <h2 className="text-white">Title</h2>
  <p className="text-slate-300">Subtitle</p>
  <button className="bg-blue-600 hover:bg-blue-700 text-white">Action</button>
</div>
```

---

## Utility Classes Reference

### Spacing
```
p-4    = padding 1rem
m-4    = margin 1rem
gap-4  = gap 1rem
px-6   = horizontal padding 1.5rem
py-3   = vertical padding 0.75rem
mt-2   = margin-top 0.5rem
```

### Typography
```
text-sm       = 14px
text-base     = 16px
text-lg       = 18px
text-2xl      = 24px
font-bold     = font-weight: 700
font-semibold = font-weight: 600
```

### Colors
```
bg-blue-600      = background color
text-gray-700    = text color
border-red-500   = border color
via-purple-600   = gradient color stop
from-/to-        = gradient start/end
```

### Sizing
```
w-full     = width: 100%
h-12       = height: 3rem
max-w-6xl  = max-width: 72rem
min-h-screen = min-height: 100vh
```

---

## Example: Complete Card Component

```jsx
<div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
  {/* Header with gradient */}
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
      📊 Title
    </h2>
  </div>

  {/* Content */}
  <div className="p-6">
    <p className="text-gray-600 text-sm font-medium mb-4">Subtitle</p>
    
    {/* Data items */}
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-700">Label</span>
        <span className="font-semibold text-blue-600">Value</span>
      </div>
    </div>

    {/* Button */}
    <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
      Action
    </button>
  </div>
</div>
```

---

## Best Practices

1. **Use Tailwind's utility classes** instead of custom CSS
2. **Follow mobile-first approach** - style for mobile, then use `md:` and `lg:` for larger screens
3. **Maintain consistent spacing** - use multiples of 4px (0.25rem increments)
4. **Use color system** - stick to defined colors for consistency
5. **Add transitions** - smooth interactions with `transition` class
6. **Test responsiveness** - check on mobile, tablet, and desktop
7. **Keep components reusable** - create abstraction for common patterns
8. **Leverage hover states** - provide visual feedback for interactive elements
9. **Ensure accessibility** - maintain color contrast, use semantic HTML
10. **Comment complex layouts** - document grid/flex structures

---

## Resources

- [Tailwind CSS Official Docs](https://tailwindcss.com/docs)
- [Tailwind Components](https://tailwindui.com)
- [Color Tools](https://www.tailwindshades.com)
