import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import HospitalDashboard from './components/HospitalDashboard';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={
          token ? (
            role === 'patient' ? <Navigate to="/patient" /> :
            role === 'doctor' ? <Navigate to="/doctor" /> :
            role === 'admin' ? <Navigate to="/hospital" /> :
            <Navigate to="/login" />
          ) : <Navigate to="/login" />
        } />
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