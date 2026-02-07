import { AlertCircle, ChevronRight, RefreshCw, Filter, Download, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import RemediationModal from './RemediationModal';

const UserTable = ({ demoMode = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  
  // Add state for filter
  const [showFilter, setShowFilter] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    minRisk: '',
    maxRisk: '',
    status: '',
    role: ''
  });
  const [activeFilters, setActiveFilters] = useState({});
  
  const fetchUsers = async (criteria = null) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (demoMode) {
        data = await api.getMockUsers();
        // Apply local filtering for demo mode
        if (criteria) {
          data = data.filter(user => {
            if (criteria.minRisk && user.riskScore < parseInt(criteria.minRisk)) return false;
            if (criteria.maxRisk && user.riskScore > parseInt(criteria.maxRisk)) return false;
            if (criteria.status && user.status !== criteria.status) return false;
            if (criteria.role && user.role !== criteria.role) return false;
            return true;
          });
        }
      } else {
        if (criteria) {
          // Call filter endpoint
          data = await api.filterUsers(criteria);
        } else {
          // Get all users
          data = await api.getUsers();
        }
      }
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Using demo data.');
      // Fallback to mock data
      const mockData = await api.getMockUsers();
      setUsers(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [demoMode]);

  const handleFilter = async () => {
    // Prepare criteria
    const criteria = {};
    if (filterCriteria.minRisk) criteria.minRisk = parseInt(filterCriteria.minRisk);
    if (filterCriteria.maxRisk) criteria.maxRisk = parseInt(filterCriteria.maxRisk);
    if (filterCriteria.status) criteria.status = filterCriteria.status;
    if (filterCriteria.role) criteria.role = filterCriteria.role;
    
    // Update active filters for display
    const filters = {};
    if (filterCriteria.minRisk) filters.minRisk = filterCriteria.minRisk;
    if (filterCriteria.maxRisk) filters.maxRisk = filterCriteria.maxRisk;
    if (filterCriteria.status) filters.status = filterCriteria.status;
    if (filterCriteria.role) filters.role = filterCriteria.role;
    setActiveFilters(filters);
    
    // Apply filter
    fetchUsers(criteria);
    setShowFilter(false);
  };

  const clearFilter = () => {
    setFilterCriteria({
      minRisk: '',
      maxRisk: '',
      status: '',
      role: ''
    });
    setActiveFilters({});
    fetchUsers(); // Reset to all users
  };

  const handleExport = async () => {
    try {
      if (demoMode) {
        // Create demo CSV
        const csvContent = "data:text/csv;charset=utf-8," 
          + "ID,Name,Role,Department,Risk Score,Permissions,Excess Permissions,Status,Last Change\n"
          + users.map(u => 
              `${u.id},${u.name},${u.role},${u.department},${u.riskScore},${u.permissions},${u.excessPermissions},${u.status},${u.lastChange}`
            ).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const blob = await api.exportUsersCSV();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      alert('✅ Users exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Export failed: ' + error.message);
    }
  };

  const getRiskColor = (score, status) => {
    if (status === 'critical') return 'bg-red-500 text-white';
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-amber-100 text-amber-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'critical': return <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Critical</span>;
      case 'high': return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">High Risk</span>;
      case 'medium': return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Medium</span>;
      default: return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Low Risk</span>;
    }
  };

  const handleReview = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleRemediationSubmit = async (actionData) => {
  // We don't need the 'api.submitRemediation' call here anymore 
  // because the Modal now handles its own fetch call.
  
  setIsModalOpen(false);
  
  // This is crucial: it refreshes the dashboard so the 
  // 85% Risk Reduction is visible immediately!
  fetchUsers(); 
};

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
              <div className="h-8 w-32 bg-gray-300 rounded"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => fetchUsers()}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 inline-block">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-blue-800 mb-1">No Users Found</h3>
            <p className="text-blue-700 text-sm mb-4">
              {demoMode ? 'Demo mode: No sample users loaded' : 'No users in the database'}
            </p>
            <button 
              onClick={() => fetchUsers()}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {users.length} {demoMode ? 'demo' : 'live'} user{users.length !== 1 ? 's' : ''}
          {Object.keys(activeFilters).length > 0 && (
            <span className="ml-2 text-blue-600">(filtered)</span>
          )}
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </button>
            
            {/* Filter Dropdown */}
            {showFilter && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border p-4 z-10">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Filter Users</h4>
                  <button 
                    onClick={() => setShowFilter(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min Risk Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={filterCriteria.minRisk}
                      onChange={(e) => setFilterCriteria({...filterCriteria, minRisk: e.target.value})}
                      className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max Risk Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={filterCriteria.maxRisk}
                      onChange={(e) => setFilterCriteria({...filterCriteria, maxRisk: e.target.value})}
                      className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Status</label>
                    <select
                      value={filterCriteria.status}
                      onChange={(e) => setFilterCriteria({...filterCriteria, status: e.target.value})}
                      className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Role</label>
                    <select
                      value={filterCriteria.role}
                      onChange={(e) => setFilterCriteria({...filterCriteria, role: e.target.value})}
                      className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Roles</option>
                      <option value="HR">HR</option>
                      <option value="Developer">Developer</option>
                      <option value="Finance">Finance</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={handleFilter}
                      className="flex-1 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Apply Filter
                    </button>
                    <button
                      onClick={clearFilter}
                      className="flex-1 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => {
              clearFilter();
              fetchUsers();
            }}
            className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-blue-800 mr-2">Active Filters:</span>
              <div className="flex flex-wrap gap-2">
                {activeFilters.minRisk && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Min Risk: {activeFilters.minRisk}
                  </span>
                )}
                {activeFilters.maxRisk && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Max Risk: {activeFilters.maxRisk}
                  </span>
                )}
                {activeFilters.status && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Status: {activeFilters.status}
                  </span>
                )}
                {activeFilters.role && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Role: {activeFilters.role}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={clearFilter}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 font-medium text-gray-700">User & Role</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Risk Status</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Risk Score</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Permissions</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Last Change</th>
              <th className="text-left py-3 px-2 font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                      user.status === 'critical' ? 'bg-red-100' : 
                      user.status === 'high' ? 'bg-red-50' : 
                      user.status === 'medium' ? 'bg-amber-50' : 'bg-green-50'
                    }`}>
                      <span className={`font-bold ${
                        user.status === 'critical' ? 'text-red-800' : 
                        user.status === 'high' ? 'text-red-700' : 
                        user.status === 'medium' ? 'text-amber-700' : 'text-green-700'
                      }`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500">{user.role}</p>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">• {user.department}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  {getStatusBadge(user.status)}
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full ${
                          user.riskScore >= 80 ? 'bg-red-500' : 
                          user.riskScore >= 60 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(user.riskScore, 100)}%` }}
                      ></div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(user.riskScore, user.status)}`}>
                      {user.riskScore}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div>
                    <span className="font-medium">{user.permissions}</span>
                    <span className="text-gray-500 text-sm"> total</span>
                  </div>
                  {user.excessPermissions > 0 && (
                    <p className="text-xs text-red-600 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {user.excessPermissions} excess permissions
                    </p>
                  )}
                </td>
                <td className="py-4 px-2 text-gray-600">{user.lastChange}</td>
                <td className="py-4 px-2">
                  <button 
                    onClick={() => handleReview(user)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Review <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        {Object.keys(activeFilters).length > 0 ? (
          <p>
            Showing {users.length} filtered users. <button 
              onClick={clearFilter}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters to see all users.
            </button>
          </p>
        ) : (
          <p>{users.length} users total. Use the filter button to narrow down results.</p>
        )}
      </div>

      <RemediationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSubmit={handleRemediationSubmit}
        demoMode={demoMode}
      />
    </>
  );
};

export default UserTable;