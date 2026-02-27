import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already logged in, redirect immediately
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      if (role === 'patient') navigate('/patient');
      else if (role === 'doctor') navigate('/doctor');
      else if (role === 'admin') navigate('/hospital');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login({ username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      if (res.data.patient_id) {
        localStorage.setItem('patientId', res.data.patient_id);
      } else {
        localStorage.removeItem('patientId');
      }
      if (res.data.doctor_id) {
        localStorage.setItem('doctorId', res.data.doctor_id);
      } else {
        localStorage.removeItem('doctorId');
      }
      if (res.data.role === 'patient') navigate('/patient');
      else if (res.data.role === 'doctor') navigate('/doctor');
      else if (res.data.role === 'admin') navigate('/hospital');
      else navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <span className="text-6xl">🏥</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">PatientAgent</h1>
            <p className="text-gray-600 text-lg">Post-Operative Care System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm font-semibold">❌ {error}</p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition bg-gray-50 text-gray-900"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition bg-gray-50 text-gray-900"
                required
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Logging in...
                </>
              ) : (
                <>
                  🔐 Login
                </>
              )}
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-2">
            <span className="font-semibold">Admin:</span> admin / password123
          </p>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">Register here</a>
          </p>
        </div> {/* end card */}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-4">
          <p>🔒 Secure login • Protected health data</p>
        </div>
      </div> {/* end container */}
    </div>
  );
}

export default Login;