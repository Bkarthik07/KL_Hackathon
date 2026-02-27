import { useState, useEffect } from 'react';
import { getAlerts, acknowledgeAlert, getPatients } from '../api';

const DoctorDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getAlerts().then(res => setAlerts(res.data));
    getPatients().then(res => setPatients(res.data));
  }, []);

  const handleAcknowledge = (id) => {
    acknowledgeAlert(id).then(() => {
      setAlerts(alerts.filter(a => a.id !== id));
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Doctor Dashboard</h1>
        
        {/* Active Alerts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Active Alerts</h2>
          {alerts.length === 0 ? (
            <div className="bg-emerald-500 bg-opacity-10 border border-emerald-500 rounded-lg p-4">
              <p className="text-emerald-400">No alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map(a => (
                <div key={a.id} className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition-shadow">
                  <div>
                    <p className="text-red-400 font-semibold">{a.name}</p>
                    <p className="text-red-300 text-sm">{a.reason}</p>
                  </div>
                  <button
                    onClick={() => handleAcknowledge(a.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Patients Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">My Patients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map(p => (
              <div key={p.id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors border border-slate-600">
                <p className="text-white font-semibold">{p.name}</p>
                <p className="text-slate-300 text-sm">{p.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;