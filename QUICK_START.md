# 🚀 Quick Start Guide - PatientAgent Frontend

## Prerequisites
- Node.js (v16+)
- npm or yarn
- Git
- **Python 3.8+ with Flask dependencies installed** (`pip install -r requirements.txt`)
- Backend server running on port 5000 (see instructions below)


---

## Installation & Setup (5 minutes)

> **Backend**: open a second terminal and run the API first (optional if already running)
> ```powershell
> # from workspace root
> $env:FLASK_APP='backend.app'
> python -m flask run --port=5000
> ```
> or simply `python backend/app.py`
> 
> Seed database if needed: `python scripts/seed_users.py`
> 
> Now return to the frontend steps below.


### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

**Server will run at**: `http://localhost:5173`

---

## 🎯 Using the Application

### Step 1: Login / Register
Go to `http://localhost:5173` and login with demo credentials (table below) or click **Register** to create a new patient account.  
Registration requires a username, phone number, and password; a patient profile will be created automatically.

Go to `http://localhost:5173` and login with demo credentials:

| Role   | Username | Password    |
|--------|----------|-------------|
| 👤 Patient | `patient` | `password123` |
| 👨‍⚕️ Doctor  | `doctor`  | `password123` |
| 🏢 Admin   | `admin`   | `password123` |

### Step 2: Explore Your Dashboard

#### 👤 As a Patient
- View your recovery progress
- See pain level trends
- Review conversations with AI agent
- Get recovery tips

#### 👨‍⚕️ As a Doctor
- Monitor patient alerts
- View patient list
- Access detailed patient records
- Manage critical alerts

#### 🏢 As an Admin
- View system statistics
- Monitor all alerts
- Manage patient directory
- Track doctor assignments

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Login.jsx        # Login page
│   │   ├── Navbar.jsx       # Navigation
│   │   ├── PatientDashboard.jsx
│   │   ├── PatientDetail.jsx
│   │   ├── DoctorDashboard.jsx
│   │   ├── HospitalDashboard.jsx
│   │   └── charts/
│   │       └── PainChart.jsx
│   ├── api.jsx              # API client
│   ├── App.jsx              # Router
│   └── index.css            # Styles
├── package.json             # Dependencies
├── vite.config.js          # Vite config
└── index.html              # HTML entry
```

---

## 🛠️ Available Commands

### Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📝 Making Changes

### Adding a New Component
```bash
# Create file
# src/components/MyComponent.jsx

import React from 'react';

export default function MyComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-4xl font-bold text-gray-900">My Component</h1>
    </div>
  );
}
```

### Adding a New Route
```jsx
// In App.jsx
<Route path="/mypath" element={<MyComponent />} />
```

### Using Tailwind Classes
```jsx
// Use utility classes instead of CSS
<div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
  {/* Content */}
</div>
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'react'"
```bash
npm install
```

### Issue: "Cannot connect to backend"
1. Ensure backend runs on `http://localhost:5000`
2. Check backend is actually running
3. Review `api.jsx` baseURL configuration

### Issue: Tailwind classes not showing
1. Restart dev server: `npm run dev`
2. Clear browser cache (Ctrl+Shift+Delete)
3. Verify `vite.config.js` has Tailwind plugin

### Issue: Blank page after login
1. Check browser console for errors (F12)
2. Verify localStorage has token: `localStorage.getItem('token')`
3. Check backend endpoints are working

### Issue: Port 5173 already in use
```bash
# Use a different port
npm run dev -- --port 5174
```

---

## 📊 Understanding the Data Flow

```
1. User logs in (Login.jsx)
   ↓
2. JWT token stored in localStorage
   ↓
3. Token added to API requests (api.jsx)
   ↓
4. Backend validates token
   ↓
5. Data returned to component
   ↓
6. Component renders with data
```

---

## 🎨 Dashboard Highlights

### Patient Dashboard
- **Pain Chart**: Visual trend of pain levels over time
- **Statistics**: Check-ins, average pain, peak pain
- **Conversations**: Expandable conversation history
- **Risk Levels**: Color-coded by severity

### Doctor Dashboard
- **Active Alerts**: Real-time patient alerts
- **Filtering**: Filter by alert type
- **Patient List**: View all assigned patients
- **Patient Details**: Click patient name to view details

### Hospital Dashboard
- **System Stats**: 5 key metrics
- **Alert Overview**: Critical alerts across system
- **Patient Directory**: Full patient table
- **Status Tracking**: Active/inactive patients

---

## 🔐 Authentication Details

- **Method**: JWT (JSON Web Token)
- **Storage**: Browser localStorage
- **Location**: Token sent as `Authorization: Bearer {token}` header
- **Expiry**: Handled by backend
- **Invalid Token**: Auto-redirects to login

---

## 📱 Responsive Design

The app works on:
- **📱 Mobile** (320px+): Single column, hamburger menu
- **⏺️ Tablet** (768px+): Two columns, full nav
- **🖥️ Desktop** (1024px+): Three+ columns, expanded

Test responsiveness:
1. Open DevTools: F12
2. Click device toolbar icon
3. Select device or drag to resize

---

## 🎯 Key Features to Try

### 1. Real-time Statistics
- Hospital Dashboard shows live patient count
- Alert counts update when acknowledged

### 2. Interactive Charts
- Patient Dashboard shows pain trends
- Hover over chart for details

### 3. Expandable Content
- Click conversations to see full details
- Alerts expand for more information

### 4. Responsive Navigation
- Resize window below 768px to see hamburger menu
- Click menu items to navigate

### 5. Role-Based Views
- Login as different roles to see different dashboards
- Try accessing routes for other roles (redirects to login)

---

## 📚 Documentation Files

- **FRONTEND_GUIDE.md** - Complete frontend documentation
- **CHANGELOG.md** - Detailed changelog of improvements
- **TAILWIND_REFERENCE.md** - Tailwind CSS patterns & examples
- **IMPLEMENTATION_SUMMARY.md** - What was built & why

---

## 💡 Tips & Tricks

### Debugging
```javascript
// In browser console check:
localStorage.getItem('token')        // Check token
localStorage.getItem('role')         // Check user role
console.log(response)                // Log API responses
```

### Development
```bash
# Hot module reloading - changes instant
npm run dev

# Faster build
npm run build

# Check for errors
npm run lint
```

### Browser DevTools
- Press F12 to open
- Check Console for errors
- Check Network tab for API calls
- Check Application > Storage for localStorage

---

## 🚀 Production Deployment

### Building
```bash
npm run build
# Creates optimized build in 'dist/' folder
```

### Deploy to Server
```bash
# Copy dist/ contents to your web server
# Or use a service like Vercel, Netlify, etc.
```

### Environment Configuration
Create `.env` file:
```
VITE_API_URL=https://api.example.com
```

Then use in app:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## ⚡ Performance Tips

1. **Reduce bundle size**: Use code splitting
2. **Optimize images**: Compress before adding
3. **Lazy load routes**: Load components on demand
4. **Minimize re-renders**: Use React.memo
5. **Cache API calls**: Implement request caching

---

## 📞 Getting Help

### Check These First
1. Browser console (F12) - Look for red errors
2. Network tab - Check API responses
3. This guide - Common issues section
4. Documentation files - FRONTEND_GUIDE.md
5. Code comments - Usually have hints

### Common Questions

**Q: How do I add a new page?**
A: Create component in `src/components/`, then add route in `App.jsx`

**Q: How do I style something?**
A: Use Tailwind classes (no custom CSS needed)

**Q: How do I call an API?**
A: Use methods from `api.jsx` module

**Q: How do I make it mobile responsive?**
A: Use `md:` and `lg:` prefixes for breakpoints

---

## ✅ Next Steps

1. **Explore the app** - Try all roles and dashboards
2. **Review code** - Check component structure
3. **Read docs** - Understand architecture
4. **Make changes** - Try adding features
5. **Deploy** - Push to production

---

## 🎉 You're Ready!

The PatientAgent frontend is ready to use. Happy developing! 🚀

For detailed information, check the documentation files:
- 📖 **FRONTEND_GUIDE.md** - Full documentation
- 📝 **CHANGELOG.md** - What changed
- 🎨 **TAILWIND_REFERENCE.md** - Styling guide
- ✨ **IMPLEMENTATION_SUMMARY.md** - Project overview

---

**Questions?** Check the documentation or review the code comments!
