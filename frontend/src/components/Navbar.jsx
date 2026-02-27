import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const getRoleDisplay = () => {
    if (role === 'admin') return 'Hospital Admin';
    if (role === 'doctor') return 'Doctor';
    if (role === 'patient') return 'Patient';
    return 'User';
  };

  const getRoleColor = () => {
    if (role === 'admin') return 'bg-purple-100 text-purple-800';
    if (role === 'doctor') return 'bg-blue-100 text-blue-800';
    if (role === 'patient') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-2">
              <span className="text-3xl">🏥</span>
              PatientAgent
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {token && (
              <>
                <div className="flex items-center gap-4">
                  {role === 'patient' && (
                    <Link to="/patient" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      📊 Dashboard
                    </Link>
                  )}
                  {role === 'doctor' && (
                    <Link to="/doctor" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      📋 Dashboard
                    </Link>
                  )}
                  {role === 'admin' && (
                    <Link to="/hospital" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      🏢 Admin Panel
                    </Link>
                  )}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor()}`}>
                    {getRoleDisplay()}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            )}
            {!token && (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <div className="pt-4 space-y-2">
              {token && (
                <>
                  {role === 'patient' && (
                    <Link
                      to="/patient"
                      className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                  )}
                  {role === 'doctor' && (
                    <Link
                      to="/doctor"
                      className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      📋 Dashboard
                    </Link>
                  )}
                  {role === 'admin' && (
                    <Link
                      to="/hospital"
                      className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🏢 Admin Panel
                    </Link>
                  )}
                  <div className="px-4 py-3 border-t border-gray-200 mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getRoleColor()}`}>
                      {getRoleDisplay()}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    🚪 Logout
                  </button>
                </>
              )}
              {!token && (
                <>
                  <Link
                    to="/login"
                    className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-center mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
