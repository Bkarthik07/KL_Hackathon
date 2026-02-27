import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAlerts, acknowledgeAlert, getPatients } from '../api';

const DoctorDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedAlert, setExpandedAlert] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAlerts().then(res => setAlerts(res.data)),
      getPatients().then(res => setPatients(res.data))
    ]).finally(() => setLoading(false));
  }, []);

  const handleAcknowledge = (id) => {
    acknowledgeAlert(id).then(() => {
      setAlerts(alerts.filter(a => a.id !== id));
    }).catch(err => {
      console.error('Failed to acknowledge alert:', err);
    });
  };

  const getAlertIcon = (alertType) => {
    const type = String(alertType).toUpperCase();
    if (type === 'HIGH_RISK') return '🚨';
    if (type === 'CRITICAL') return '⚠️';
    if (type === 'WARNING') return '⚡';
    return 'ℹ️';
  };

  const getAlertColor = (alertType) => {
    const type = String(alertType).toUpperCase();
    if (type === 'HIGH_RISK' || type === 'CRITICAL') {
      return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800', badge: 'bg-red-100 text-red-800' };
    }
    if (type === 'WARNING') {
      return { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-800' };
    }
    return { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800', badge: 'bg-blue-100 text-blue-800' };
  };

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => String(a.alert_type).toUpperCase() === filter.toUpperCase());
  const activePatients = patients.filter(p => p.is_active);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            👨‍⚕️ Doctor Dashboard
          </h1>
          <p className="text-lg text-slate-300">
            Monitor your patients and manage critical alerts
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 border border-slate-600">
            <p className="text-slate-300 text-sm font-medium mb-1">Active Alerts</p>
            <p className="text-4xl font-bold text-red-400">{alerts.length}</p>
            <p className="text-xs text-slate-400 mt-2">Requiring attention</p>
          </div>
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 border border-slate-600">
            <p className="text-slate-300 text-sm font-medium mb-1">My Patients</p>
            <p className="text-4xl font-bold text-blue-400">{activePatients.length}</p>
            <p className="text-xs text-slate-400 mt-2">Currently under care</p>
          </div>
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 border border-slate-600">
            <p className="text-slate-300 text-sm font-medium mb-1">Total Patients</p>
            <p className="text-4xl font-bold text-green-400">{patients.length}</p>
            <p className="text-xs text-slate-400 mt-2">All time</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-700 rounded-xl shadow-lg overflow-hidden border border-slate-600">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  🚨 Critical Alerts
                </h2>
              </div>
              
              {/* Filter Buttons */}
              <div className="bg-slate-800 px-6 py-3 flex flex-wrap gap-2 border-b border-slate-600">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    filter === 'all'
                      ? 'bg-white text-slate-900'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('HIGH_RISK')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    filter === 'HIGH_RISK'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  High Risk
                </button>
                <button
                  onClick={() => setFilter('CRITICAL')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    filter === 'CRITICAL'
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Critical
                </button>
              </div>

              <div className="p-6">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-emerald-400 text-lg font-semibold mb-2">✓ All clear!</p>
                    <p className="text-slate-400">No {filter === 'all' ? 'alerts' : filter.toLowerCase()} alerts at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAlerts.map(a => {
                      const colors = getAlertColor(a.alert_type);
                      return (
                        <div 
                          key={a.id} 
                          className={`${colors.bg} border-l-4 ${colors.border} p-4 rounded-r-lg hover:shadow-lg transition-all cursor-pointer`}
                          onClick={() => setExpandedAlert(expandedAlert === a.id ? null : a.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{getAlertIcon(a.alert_type)}</span>
                                <p className={`font-bold text-lg ${colors.text}`}>{a.name}</p>
                                <span className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded border ${colors.badge} border-current`}>
                                  {a.alert_type}
                                </span>
                              </div>
                              <p className={`${colors.text} text-sm mt-1`}>{a.reason}</p>
                              <p className={`${colors.text} text-xs opacity-75 mt-2 font-mono`}>
                                {new Date(a.created_at).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcknowledge(a.id);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm whitespace-nowrap ml-2"
                            >
                              ✓ Acknowledge
                            </button>
                          </div>
                          
                          {expandedAlert === a.id && (
                            <div className="mt-4 pt-4 border-t border-current border-opacity-20 text-slate-700">
                              <p className="text-sm font-semibold mb-2">Alert Details</p>
                              <div className="bg-white bg-opacity-50 p-3 rounded text-sm space-y-1">
                                <p><strong>Patient:</strong> {a.name}</p>
                                <p><strong>Alert Type:</strong> {a.alert_type}</p>
                                <p><strong>Reason:</strong> {a.reason}</p>
                                <p><strong>Time:</strong> {new Date(a.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-700 rounded-xl shadow-lg p-6 border border-slate-600">
              <h3 className="text-lg font-bold text-white mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm">
                  📝 View Patient Details
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm">
                  📊 View Pain Trends
                </button>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm">
                  💬 View Conversations
                </button>
              </div>
            </div>

            {/* Patient Summary */}
            <div className="bg-slate-700 rounded-xl shadow-lg overflow-hidden border border-slate-600">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-lg font-bold text-white">👥 Patient Summary</h3>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {activePatients.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No patients assigned yet</p>
                ) : (
                  activePatients.slice(0, 5).map(p => (
                    <div 
                      key={p.id} 
                      className="bg-slate-800 p-3 rounded-lg border border-slate-600 hover:border-blue-500 transition-colors cursor-pointer hover:bg-slate-700"
                    >
                      <p className="text-white font-semibold text-sm">{p.name}</p>
                      <p className="text-slate-400 text-xs font-mono mt-1">{p.phone}</p>
                      <p className="text-slate-400 text-xs mt-1">
                        Surgery: {p.surgery_date ? new Date(p.surgery_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  ))
                )}
                {activePatients.length > 5 && (
                  <p className="text-slate-400 text-center pt-2 text-sm border-t border-slate-600">
                    +{activePatients.length - 5} more patients
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="mt-8 bg-slate-700 rounded-xl shadow-lg overflow-hidden border border-slate-600">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              📋 Patient List
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800 border-b border-slate-600">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Patient Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Surgery Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  patients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-600 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">
                        <Link to={`/patient/${p.id}`} className="hover:text-blue-400 transition-colors">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-sm">{p.phone}</td>
                      <td className="px-6 py-4 text-slate-300">{new Date(p.surgery_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          p.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-500 text-white'
                        }`}>
                          {p.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;