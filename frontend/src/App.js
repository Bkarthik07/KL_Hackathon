import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import HospitalDashboard from './components/HospitalDashboard';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/patient" element={token && role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" />} />
        <Route path="/doctor" element={token && role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} />
        <Route path="/hospital" element={token && role === 'admin' ? <HospitalDashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;