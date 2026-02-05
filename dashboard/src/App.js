import { useState, useEffect } from 'react';
import { Users, ShieldAlert, Activity, FileText, Bell, Shield, RefreshCw } from 'lucide-react';
import UserTable from './components/UserTable';
import AnomaliesList from './components/AnomaliesList';
import PermissionChart from './components/Charts';
import QuickActions from './components/QuickActions';
import ComplianceReport from './components/ComplianceReport';
import { api, checkBackendHealth } from './services/api';

function App() {
  const [demoMode, setDemoMode] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 142,
    high_risk_users: 8,
    anomalies_detected: 23,
    compliance_score: 92
  });
  const [anomalies, setAnomalies] = useState([]);
  
  useEffect(() => {
    checkBackendConnection();
    if (!demoMode) {
      fetchRealData();
    }
  }, [demoMode]);
  
  const checkBackendConnection = async () => {
    try {
      const connected = await checkBackendHealth();
      setBackendConnected(connected);
      console.log(`Backend ${connected ? 'connected' : 'disconnected'}`);
    } catch (error) {
      console.error('Backend check failed:', error);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRealData = async () => {
    try {
      console.log('Fetching real data from backend...');
      const [statsData, anomaliesData] = await Promise.all([
        api.getStats(),
        api.getAnomalies()
      ]);
      setStats(statsData);
      setAnomalies(anomaliesData);
      console.log('Data fetched successfully');
    } catch (error) {
      console.error('Failed to fetch real data, switching to demo mode:', error);
      setDemoMode(true);
      // Use mock data as fallback
      setStats({
        total_users: 142,
        high_risk_users: 8,
        anomalies_detected: 23,
        compliance_score: 92
      });
      setAnomalies(await api.getMockAnomalies());
    }
  };
  
  const handleToggleDemoMode = () => {
    const newMode = !demoMode;
    setDemoMode(newMode);
    if (!newMode) {
      // If switching to real mode, fetch data
      fetchRealData();
    }
  };
  
  const handleRunHealthCheck = async () => {
    try {
      if (!demoMode) {
        await api.calculateRisks();
        // Refresh data
        fetchRealData();
        alert('✅ AI risk analysis completed! Data refreshed.');
      } else {
        alert('🔧 In demo mode - would trigger AI analysis in production');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  
  const handleRefreshData = () => {
    if (!demoMode) {
      fetchRealData();
    }
  };

  // Add connection status to navbar
  const renderConnectionStatus = () => {
    if (loading) {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded ml-2">
          Checking...
        </span>
      );
    }
    return backendConnected ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded ml-2">
        Backend Connected
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded ml-2">
        Using Demo Data
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">AccessGuardian AI</h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">Team Obsidian</span>
              {renderConnectionStatus()}
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleRefreshData}
                  className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  disabled={demoMode}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${!demoMode ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={demoMode} 
                        onChange={handleToggleDemoMode} 
                      />
                      <div className={`block w-14 h-8 rounded-full ${demoMode ? 'bg-blue-600' : 'bg-green-600'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${demoMode ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium text-sm">
                      {demoMode ? 'Demo Mode' : 'Live Mode'}
                    </div>
                  </label>
                </div>
              </div>
              
              <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-blue-600" />
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">Atharv Devikar</p>
                  <p className="text-xs text-gray-500">Team Lead</p>
                </div>
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  AD
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.total_users}</p>
                <p className={`text-xs mt-1 ${demoMode ? 'text-green-600' : 'text-blue-600'}`}>
                  {demoMode ? '↑ 12 this month' : 'Live from database'}
                </p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">High Risk Users</p>
                <p className="text-3xl font-bold mt-2 text-red-600">{stats.high_risk_users}</p>
                <p className="text-xs text-red-600 mt-1">
                  {stats.high_risk_users > 5 ? 'Requires immediate action' : 'Within safe limits'}
                </p>
              </div>
              <ShieldAlert className="h-10 w-10 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Anomalies Detected</p>
                <p className="text-3xl font-bold mt-2 text-amber-600">{stats.anomalies_detected}</p>
                <p className="text-xs text-amber-600 mt-1">
                  {demoMode ? 'AI-detected threats' : 'Live AI monitoring'}
                </p>
              </div>
              <Activity className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Compliance Score</p>
                <p className="text-3xl font-bold mt-2 text-green-600">{stats.compliance_score}%</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.compliance_score > 90 ? 'A+ Security Rating' : 'Needs improvement'}
                </p>
              </div>
              <FileText className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </div>
        
        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Risk Assessment */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">User Risk Assessment</h2>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                    Filter
                  </button>
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Export
                  </button>
                </div>
              </div>
              <UserTable demoMode={demoMode} />
            </div>
            
            {/* Permission Trend Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Permission Creep Trend</h2>
              <div className="h-80">
                <PermissionChart />
              </div>
            </div>

            {/* Compliance Report */}
            <div className="bg-white rounded-xl shadow p-6">
              <ComplianceReport />
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Recent Anomalies */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Anomalies</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  demoMode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {demoMode ? 'Demo' : 'Live'}
                </span>
              </div>
              <AnomaliesList anomalies={anomalies} demoMode={demoMode} />
              <button className="w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-800 font-medium border border-dashed border-blue-200 rounded-lg">
                View All Anomalies →
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <QuickActions />
            </div>
            
            {/* Compliance Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold mb-3">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">AI Monitoring</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {demoMode ? 'Demo' : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Real-time Detection</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {demoMode ? 'Simulated' : 'Enabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Data Source</span>
                  <span className="text-gray-900 font-medium">
                    {demoMode ? 'Mock Data' : 'Live Database'}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleRunHealthCheck}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
              >
                <Activity className="h-5 w-5 mr-2" />
                Run AI Risk Analysis
              </button>
            </div>
          </div>
        </div>
        
        {/* Demo Mode Banner */}
        {demoMode && (
          <div className="fixed bottom-4 right-4 bg-amber-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <Activity className="h-5 w-5" />
            <span>Demo Mode Active - Using mock data</span>
            <button 
              onClick={() => setDemoMode(false)}
              className="px-3 py-1 bg-white text-amber-700 rounded text-sm font-medium hover:bg-gray-100"
            >
              Switch to Live
            </button>
          </div>
        )}
        
        {/* Backend Connection Banner */}
        {!demoMode && !backendConnected && (
          <div className="fixed bottom-4 left-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <ShieldAlert className="h-5 w-5" />
            <span>Backend connection failed - Using fallback data</span>
            <button 
              onClick={checkBackendConnection}
              className="px-3 py-1 bg-white text-red-700 rounded text-sm font-medium hover:bg-gray-100"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;