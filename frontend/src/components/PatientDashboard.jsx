import { useState, useEffect } from 'react';
import { getPatientConversations, getPainTrend } from '../api';
import PainChart from './charts/PainChart';

const PatientDashboard = () => {
  const patientId = localStorage.getItem('patientId');
  const [conversations, setConversations] = useState([]);
  const [painData, setPainData] = useState([]);

  useEffect(() => {
    if (!patientId) return;
    getPatientConversations(patientId).then(res => setConversations(res.data));
    getPainTrend(patientId).then(res => setPainData(res.data));
  }, [patientId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">My Recovery Dashboard</h2>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <PainChart data={painData} />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Recent Conversations</h3>
          <div className="space-y-4">
            {conversations.map(c => (
              <div key={c.id} className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded hover:bg-gray-100 transition">
                <p className="text-sm text-gray-500 mb-2">{c.created_at}</p>
                <p className="text-gray-800 mb-2"><strong className="text-indigo-600">You:</strong> {c.patient_message}</p>
                <p className="text-gray-800"><strong className="text-green-600">Agent:</strong> {c.agent_response}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">Risk: {c.risk_level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;