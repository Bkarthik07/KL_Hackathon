import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientConversations, getPainTrend } from '../api';
import PainChart from './charts/PainChart';

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [painData, setPainData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedConversation, setExpandedConversation] = useState(null);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    Promise.all([
      getPatientConversations(patientId).then(res => setConversations(res.data)),
      getPainTrend(patientId).then(res => setPainData(res.data))
    ]).finally(() => setLoading(false));
  }, [patientId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading patient details...</p>
        </div>
      </div>
    );
  }

  const getAveragePain = () => {
    if (painData.length === 0) return 0;
    const sum = painData.reduce((acc, p) => acc + (parseInt(p.pain) || 0), 0);
    return (sum / painData.length).toFixed(1);
  };

  const getTrend = () => {
    if (painData.length < 2) return 'stable';
    const recent = parseInt(painData[0]?.pain) || 0;
    const older = parseInt(painData[painData.length - 1]?.pain) || 0;
    if (recent > older) return 'increasing';
    if (recent < older) return 'decreasing';
    return 'stable';
  };

  const getRiskLevel = (level) => {
    const levelStr = String(level).toUpperCase();
    if (levelStr === 'HIGH') return { color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-100 text-red-800' };
    if (levelStr === 'MEDIUM') return { color: 'text-yellow-600', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800' };
    return { color: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-4 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Patient Details
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive patient health records and recovery tracking
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Total Check-ins</p>
            <p className="text-3xl font-bold text-blue-600">{conversations.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Average Pain</p>
            <p className="text-3xl font-bold text-purple-600">{getAveragePain()}/10</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Pain Trend</p>
            <p className="text-lg font-bold text-green-600 capitalize">{getTrend()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Recovery Days</p>
            <p className="text-3xl font-bold text-orange-600">{painData.length}</p>
          </div>
        </div>

        {/* Pain Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Pain Level Trend</h2>
          <PainChart data={painData} />
        </div>

        {/* Conversations Timeline */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              💬 Patient Conversations ({conversations.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-lg">No conversations recorded yet</p>
              </div>
            ) : (
              conversations.map((c, idx) => {
                const riskColors = getRiskLevel(c.risk_level);
                return (
                  <div
                    key={c.id}
                    className="p-6 hover:bg-gray-50 transition-colors border-l-4 border-indigo-500 cursor-pointer"
                    onClick={() => setExpandedConversation(expandedConversation === c.id ? null : c.id)}
                  >
                    {/* Timeline Dot */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-indigo-600 border-4 border-white"></div>
                        {idx < conversations.length - 1 && (
                          <div className="w-1 h-12 bg-indigo-200 mt-2 mb-2"></div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-500 font-mono mb-2">
                              {new Date(c.created_at).toLocaleString()}
                            </p>
                            <p className="text-gray-900 font-semibold">Patient Message:</p>
                            <p className="text-gray-700 mt-1">{c.patient_message}</p>
                          </div>
                          <span className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold border whitespace-nowrap ${riskColors.badge}`}>
                            {c.risk_level}
                          </span>
                        </div>

                        {expandedConversation === c.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-gray-900 font-semibold flex items-center gap-2 mb-2">🤖 Agent Response</p>
                              <p className="text-gray-700 leading-relaxed">{c.agent_response}</p>
                            </div>

                            {c.extracted_symptoms && (
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-900 mb-2">📋 Extracted Symptoms</p>
                                <pre className="text-sm text-gray-700 overflow-x-auto">
                                  {JSON.stringify(JSON.parse(c.extracted_symptoms), null, 2)}
                                </pre>
                              </div>
                            )}

                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-sm font-semibold text-gray-900 mb-2">⚠️ Risk Assessment</p>
                              <p className={`text-sm font-semibold ${riskColors.color}`}>
                                Risk Level: {c.risk_level}
                              </p>
                            </div>
                          </div>
                        )}

                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold mt-2">
                          {expandedConversation === c.id ? '▼ Hide Details' : '▶ Show Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Clinical Notes */}
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-purple-200">
          <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
            📝 Clinical Notes
          </h3>
          <textarea
            className="w-full p-4 border border-purple-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Add clinical notes for this patient..."
            rows="4"
          />
          <button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
