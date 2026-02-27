const HospitalDashboard = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Hospital Admin Dashboard
        </h1>
        <p className="text-lg text-slate-600">
          Aggregate statistics and management tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="h-12 w-12 bg-blue-100 rounded-lg mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Metric {i}
            </h3>
            <p className="text-2xl font-bold text-blue-600 mb-1">0</p>
            <p className="text-sm text-slate-500">Coming soon</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Management Tools
        </h2>
        <p className="text-slate-600">
          Additional features and management tools coming soon.
        </p>
      </div>
    </div>
  </div>
);

export default HospitalDashboard;