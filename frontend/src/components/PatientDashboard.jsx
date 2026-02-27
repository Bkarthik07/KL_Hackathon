import { useState, useEffect } from 'react';
import { getPatientConversations, getPainTrend } from '../api';
import PainChart from './charts/PainChart';

const PatientDashboard = () => {
  const patientId = localStorage.getItem('patientId');
  const [conversations, setConversations] = useState([]);
  const [painData, setPainData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedConversation, setExpandedConversation] = useState(null);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      getPatientConversations(patientId).then(res => setConversations(res.data)),
      getPainTrend(patientId).then(res => setPainData(res.data))
    ]).finally(() => setLoading(false));
  }, [patientId]);

  const getRiskColor = (level) => {
    const levelStr = String(level).toUpperCase();
    if (levelStr === 'HIGH') return 'bg-red-100 text-red-800 border-red-300';
    if (levelStr === 'MEDIUM') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getHighestPain = () => {
    if (painData.length === 0) return 0;
    return Math.max(...painData.map(p => parseInt(p.pain) || 0));
  };

  const getAveragePain = () => {
    if (painData.length === 0) return 0;
    const sum = painData.reduce((acc, p) => acc + (parseInt(p.pain) || 0), 0);
    return (sum / painData.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your recovery dashboard...</p>
        </div>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-4">No patient profile is associated with your account.</p>
          <p className="text-gray-600">Please contact an administrator to set up your profile or try registering as a patient.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Recovery Dashboard 💪
          </h1>
          <p className="text-lg text-gray-600">
            Track your progress and manage your recovery
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Total Check-ins</p>
            <p className="text-4xl font-bold text-blue-600">{conversations.length}</p>
            <p className="text-xs text-gray-500 mt-2">Conversations with agent</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Average Pain Level</p>
            <p className="text-4xl font-bold text-purple-600">{getAveragePain()}/10</p>
            <p className="text-xs text-gray-500 mt-2">Over tracking period</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Peak Pain Level</p>
            <p className="text-4xl font-bold text-orange-600">{getHighestPain()}/10</p>
            <p className="text-xs text-gray-500 mt-2">Highest recorded level</p>
          </div>
        </div>

        {/* Pain Trend Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Pain Level Trend</h2>
          <PainChart data={painData} />
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              💬 Recent Check-ins & Conversations
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-lg">No conversations yet. Start your first check-in!</p>
              </div>
            ) : (
              conversations.map(c => (
                <div 
                  key={c.id} 
                  className="p-6 hover:bg-gray-50 transition-colors border-l-4 border-indigo-500 cursor-pointer"
                  onClick={() => setExpandedConversation(expandedConversation === c.id ? null : c.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-mono">
                        {new Date(c.created_at).toLocaleString()}
                      </p>
                      <p className="text-gray-900 font-semibold mt-2">Your message:</p>
                      <p className="text-gray-700 mt-1">{c.patient_message}</p>
                    </div>
                    <span className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold border whitespace-nowrap ${getRiskColor(c.risk_level)}`}>
                      {c.risk_level}
                    </span>
                  </div>
                  
                  {expandedConversation === c.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 font-semibold flex items-center gap-2">🤖 Agent Response:</p>
                      <p className="text-gray-700 mt-2 leading-relaxed">{c.agent_response}</p>
                      {c.extracted_symptoms && (
                        <div className="mt-4 p-3 bg-white rounded border border-gray-300">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Detected Symptoms:</p>
                          <p className="text-sm text-gray-600">{JSON.stringify(c.extracted_symptoms)}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold mt-2">
                    {expandedConversation === c.id ? '▼ Hide Details' : '▶ Show Details'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recovery Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border border-green-200">
          <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
            📋 Recovery Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-2">
              <span>✓</span>
              <p className="text-green-800">Complete all check-ins regularly to help track progress</p>
            </div>
            <div className="flex gap-2">
              <span>✓</span>
              <p className="text-green-800">Report pain levels accurately for better assessment</p>
            </div>
            <div className="flex gap-2">
              <span>✓</span>
              <p className="text-green-800">Contact your doctor if pain levels increase significantly</p>
            </div>
            <div className="flex gap-2">
              <span>✓</span>
              <p className="text-green-800">Follow post-operative care instructions closely</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;