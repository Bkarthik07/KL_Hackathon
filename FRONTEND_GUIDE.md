# PatientAgent Frontend - Development Guide

## Overview
A modern, responsive React + Vite + Tailwind CSS frontend for the PatientAgent post-operative care system. The application provides role-based dashboards for patients, doctors, and hospital administrators with comprehensive health monitoring capabilities.

## Technology Stack
- **React 19** - UI framework
- **Vite 8** - Build tool with HMR
- **Tailwind CSS 4** - Utility-first CSS
- **React Router DOM 7** - Client-side routing
- **Recharts 3** - Data visualization
- **Axios** - HTTP client

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx                 # Login page with demo credentials
│   │   ├── Navbar.jsx                # Main navigation (responsive)
│   │   ├── PatientDashboard.jsx      # Patient recovery dashboard
│   │   ├── PatientDetail.jsx         # Detailed patient view (for doctors)
│   │   ├── DoctorDashboard.jsx       # Doctor's patient management dashboard
│   │   ├── HospitalDashboard.jsx     # Admin analytics & statistics
│   │   └── charts/
│   │       └── PainChart.jsx         # Pain level trend visualization
│   ├── api.jsx                       # API client with axios & interceptors
│   ├── App.jsx                       # Main router configuration
│   ├── main.jsx                      # React entry point
│   ├── index.css                     # Global styles (Tailwind)
│   └── App.css                       # Tailwind imports
├── index.html                        # HTML entry point
├── vite.config.js                    # Vite configuration with Tailwind
├── tailwind.config.js                # Tailwind theme (auto-generated)
├── package.json                      # Dependencies
└── eslint.config.js                  # Linting rules
```

## Key Features

### Authentication & Authorization
- JWT-based authentication with role-based access control
- Three user roles: Patient, Doctor, Admin
- Automatic redirection based on user role
- Protected routes requiring valid token

### Patient Dashboard
- **Recovery Overview**: Total check-ins, average pain levels, peak pain tracking
- **Pain Trend Chart**: Visual representation of pain level progression
- **Conversation History**: Detailed conversation logs with AI agent
- **Risk Assessment**: Color-coded risk levels (Low, Medium, High)
- **Recovery Tips**: Evidence-based recovery guidance

### Doctor Dashboard
- **Critical Alerts**: Real-time patient alerts with filtering options
- **Alert Management**: Acknowledge and track alert resolution
- **Patient List**: View all assigned and historical patients
- **Quick Actions**: Links to patient details, pain trends, and conversations
- **Patient Summary**: Quick overview of current patient roster

### Hospital Admin Dashboard
- **System Statistics**:
  - Active patient count
  - Total doctors in system
  - Unacknowledged alerts
  - High-risk patient tracking
  - Recent activity metrics
- **Alert Management**: Overview of critical alerts across all patients
- **Patient Directory**: Comprehensive patient table with:
  - Patient information (name, phone, surgery date)
  - Associated doctor
  - Conversation count
  - Alert status
  - Active/inactive status

### Patient Detail View
- Comprehensive patient health records
- Conversation timeline with expandable details
- Pain trend analysis and tracking
- Clinical notes section
- Risk assessment visualization
- Symptom tracking and extraction

### Navigation
- **Desktop**: Full horizontal navigation with user role display
- **Mobile**: Responsive hamburger menu
- **Role-based Navigation**: Different links based on user role
- **Status Indicators**: User role badges with color coding

## Styling with Tailwind CSS

### Design System
- **Color Palette**:
  - Blue/Indigo: Primary actions and patient dashboard
  - Red/Orange: Alerts and warnings
  - Green: Success and positive indicators
  - Slate: Dark themes and admin dashboards
  - Purple: Secondary actions and details

- **Spacing**: Consistent padding/margin using Tailwind's scale
- **Typography**: Responsive font sizes and weights
- **Shadows**: Subtle to prominent shadows for depth
- **Borders**: Colored left-borders for status indication

### Key CSS Classes Used
- `bg-gradient-to-br`: Directional gradients
- `hover:shadow-lg`: Interactive feedback
- `transition-colors/shadow`: Smooth state changes
- `flex/grid`: Responsive layouts
- `rounded-xl`: Modern border radius
- `border-l-4`: Status indicators

## API Endpoints

### Authentication
- `POST /api/login` - User login

### Patient APIs
- `GET /api/patients` - List all patients (doctor/admin only)
- `GET /api/patients/<id>` - Get patient details
- `GET /api/patients/<id>/conversations` - Patient conversations
- `GET /api/patients/<id>/pain-trend` - Pain level trends

### Alert APIs
- `GET /api/alerts` - Get active alerts
- `POST /api/alerts/<id>/acknowledge` - Acknowledge alert

### Hospital Admin APIs
- `GET /api/hospital/stats` - System statistics
- `GET /api/hospital/alerts-summary` - Recent alerts
- `GET /api/hospital/patient-list` - Comprehensive patient list

## Running the Frontend

### Development
```bash
cd frontend
npm install
npm run dev
```
Server runs on `http://localhost:5173` by default.

### Production Build
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

## Demo Credentials
- **Patient**: username: `patient` | password: `password123`
- **Doctor**: username: `doctor` | password: `password123`
- **Admin**: username: `admin` | password: `password123`

## Component Interactions

### Data Flow
1. User logs in via `Login.jsx`
2. JWT token stored in localStorage
3. `api.jsx` intercepts requests and adds Authorization header
4. Role-based routing directs to appropriate dashboard
5. Dashboard components fetch data from backend APIs
6. Data displayed with Tailwind-styled components

### Error Handling
- 401 responses trigger automatic logout and redirect to login
- User-friendly error messages for failed logins
- Loading states with spinner animations
- Graceful handling of empty data states

## Responsive Design Breakpoints
- **Mobile**: Default (< 768px) - Single column, hamburger menu
- **Tablet**: `md:` (768px+) - Two columns, full navigation
- **Desktop**: `lg:` (1024px+) - Three+ columns, expanded layouts

## Performance Optimizations
- React Router lazy loading (future enhancement)
- Memoized components for chart rendering
- Efficient state management with React hooks
- Axios request/response interceptors for centralized error handling

## Accessibility Features
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance with WCAG
- Focus indicators for keyboard users

## Future Enhancements
- [ ] Patient messaging system
- [ ] Real-time notifications
- [ ] Advanced analytics and reporting
- [ ] Export patient data to PDF
- [ ] Integration with wearable devices
- [ ] Appointment scheduling
- [ ] Medical record attachments
- [ ] Dark mode theme toggle

## Troubleshooting

### Frontend won't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check `api.jsx` baseURL matches your backend URL
- Verify CORS is enabled in backend

### Tailwind classes not applying
- Run `npm install` to ensure dependencies installed
- Check Tailwind is properly configured in `vite.config.js`
- Clear browser cache and restart dev server

### Authentication issues
- Verify JWT token is stored in localStorage
- Check token expiration and refresh logic
- Review backend auth middleware

## Code Quality
- ESLint configured for React best practices
- Consistent formatting with Tailwind conventions
- Component-based architecture for reusability
- Clear separation of concerns

## Contributing
- Follow existing component structure
- Use Tailwind CSS for styling (no custom CSS)
- Implement responsive design with mobile-first approach
- Add loading states and error handling
- Document complex component logic

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
