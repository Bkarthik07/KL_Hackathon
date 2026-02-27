import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHospitalStats, getHospitalAlerts, getHospitalPatients, acknowledgeAlert } from '../api';

const StatCard = ({ icon, label, value, trend, color }) => (
  <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-${color}-200`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`h-12 w-12 bg-${color}-200 rounded-lg flex items-center justify-center text-${color}-700 text-xl`}>
        {icon}
      </div>
      {trend && <span className={`text-sm font-semibold px-3 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>}
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{label}</h3>
    <p className={`text-3xl font-bold text-${color}-700`}>{value}</p>
  </div>
);

const HospitalDashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getHospitalStats().then(r => setStats(r.data)),
      getHospitalAlerts().then(r => setAlerts(r.data)),
      getHospitalPatients().then(r => setPatients(r.data))
    ]).finally(() => setLoading(false));
  }, []);

  const handleAcknowledge = (id) => {
    acknowledgeAlert(id).then(() => {
      setAlerts(alerts.filter(a => a.id !== id));
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
            Hospital Admin Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Manage patients, doctors, and monitor system health
          </p>
        </div>

        {/* Stats Cards Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard 
              icon="👥" 
              label="Active Patients" 
              value={stats.total_patients}
              trend={5}
              color="blue"
            />
            <StatCard 
              icon="👨‍⚕️" 
              label="Total Doctors" 
              value={stats.total_doctors}
              color="indigo"
            />
            <StatCard 
              icon="🚨" 
              label="Active Alerts" 
              value={stats.active_alerts}
              trend={-12}
              color="red"
            />
            <StatCard 
              icon="⚠️" 
              label="High Risk Cases" 
              value={stats.high_risk_patients}
              color="orange"
            />
            <StatCard 
              icon="📊" 
              label="Recent Activity" 
              value={stats.recovery_rate}
              trend={8}
              color="green"
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Critical Alerts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  🚨 Critical Alerts
                </h2>
              </div>
              <div className="p-6">
                {alerts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-green-600 text-lg font-semibold">✓ All clear - No active alerts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map(alert => (
                      <div key={alert.id} className="border-l-4 border-red-600 bg-red-50 p-4 rounded-r-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-red-900">{alert.name}</p>
                            <p className="text-red-700 text-sm mt-1">{alert.reason}</p>
                            <p className="text-red-600 text-xs mt-2 font-mono">{new Date(alert.created_at).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm whitespace-nowrap ml-2"
                          >
                            Acknowledge
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">📈 Key Metrics</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-gray-600 text-sm mb-1">Patient Recovery Rate</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.recovery_rate || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Active in last 7 days</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-gray-600 text-sm mb-1">System Utilization</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats ? Math.round((stats.total_patients / (stats.total_patients + 10)) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Capacity usage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              👥 Patient Directory
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Doctor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Surgery Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Conversations</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Alerts</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  patients.map(patient => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        <Link to={`/patient/${patient.id}`} className="hover:text-blue-600 transition-colors">
                          {patient.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono text-sm">{patient.phone}</td>
                      <td className="px-6 py-4 text-gray-700">{patient.doctor_name || 'Unassigned'}</td>
                      <td className="px-6 py-4 text-gray-700">{new Date(patient.surgery_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-semibold">
                          {patient.conversation_count}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {patient.alert_count > 0 ? (
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-semibold">
                            {patient.alert_count}
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            ✓ Clear
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          patient.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.is_active ? 'Active' : 'Inactive'}
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

export default HospitalDashboard;