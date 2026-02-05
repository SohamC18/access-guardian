import { AlertCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import RemediationModal from './RemediationModal';

const UserTable = ({ demoMode = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (demoMode) {
        data = await api.getMockUsers();
      } else {
        data = await api.getUsers();
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
    try {
      if (!demoMode) {
        await api.submitRemediation({
          userId: selectedUser.name, // Username from backend
          permission: actionData.permission_to_remove
        });
        alert('✅ Remediation action submitted successfully!');
      } else {
        alert('🔧 Demo: Remediation action would be submitted in production');
      }
      setIsModalOpen(false);
      // Refresh user data
      fetchUsers();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleExport = () => {
    if (demoMode) {
      alert('📊 Demo: Would export CSV with user risk data');
    } else {
      alert('📊 Exporting real user data to CSV...');
      // In real app, implement CSV export
    }
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
            onClick={fetchUsers}
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
              onClick={fetchUsers}
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
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={fetchUsers}
            className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
          <button 
            onClick={handleExport}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

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