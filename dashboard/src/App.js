import { useState } from 'react';
import { Users, ShieldAlert, Activity, FileText, Bell, Shield } from 'lucide-react';
import UserTable from './components/UserTable';
import AnomaliesList from './components/AnomaliesList';
import PermissionChart from './components/Charts';
import QuickActions from './components/QuickActions';
import ComplianceReport from './components/ComplianceReport';
function App() {
  const [demoMode, setDemoMode] = useState(true);
  
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
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={demoMode} 
                      onChange={() => setDemoMode(!demoMode)} 
                    />
                    <div className={`block w-14 h-8 rounded-full ${demoMode ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${demoMode ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 font-medium text-sm">Demo Mode</div>
                </label>
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
                <p className="text-3xl font-bold mt-2">142</p>
                <p className="text-xs text-green-600 mt-1">↑ 12 this month</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">High Risk Users</p>
                <p className="text-3xl font-bold mt-2 text-red-600">8</p>
                <p className="text-xs text-red-600 mt-1">Requires immediate action</p>
              </div>
              <ShieldAlert className="h-10 w-10 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Anomalies Detected</p>
                <p className="text-3xl font-bold mt-2 text-amber-600">23</p>
                <p className="text-xs text-amber-600 mt-1">AI-detected threats</p>
              </div>
              <Activity className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Compliance Score</p>
                <p className="text-3xl font-bold mt-2 text-green-600">92%</p>
                <p className="text-xs text-green-600 mt-1">A+ Security Rating</p>
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
              <UserTable />
            </div>
            
            {/* Permission Trend Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Permission Creep Trend</h2>
              <div className="h-80">
                <PermissionChart />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
  <ComplianceReport />
</div>
          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Recent Anomalies */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Anomalies</h2>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  Live
                </span>
              </div>
              <AnomaliesList />
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
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Real-time Detection</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Last Audit</span>
                  <span className="text-gray-900 font-medium">2 hours ago</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Run System Health Check
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
              Disable
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;