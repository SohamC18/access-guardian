import { AlertCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const UserTable = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  
  const users = [
    { 
      id: 1, 
      name: 'Alex Johnson', 
      role: 'Senior Developer', 
      department: 'Engineering',
      riskScore: 92, 
      permissions: 24, 
      excessPermissions: 8,
      lastChange: '2 days ago',
      status: 'high'
    },
    { 
      id: 2, 
      name: 'Sarah Chen', 
      role: 'Marketing Lead', 
      department: 'Marketing',
      riskScore: 15, 
      permissions: 8, 
      excessPermissions: 0,
      lastChange: '1 week ago',
      status: 'low'
    },
    { 
      id: 3, 
      name: 'Mike Rodriguez', 
      role: 'Project Manager', 
      department: 'Operations',
      riskScore: 78, 
      permissions: 18, 
      excessPermissions: 5,
      lastChange: '1 day ago',
      status: 'medium'
    },
    { 
      id: 4, 
      name: 'Emma Davis', 
      role: 'HR Manager', 
      department: 'Human Resources',
      riskScore: 45, 
      permissions: 12, 
      excessPermissions: 2,
      lastChange: '3 days ago',
      status: 'low'
    },
    { 
      id: 5, 
      name: 'James Wilson', 
      role: 'System Admin', 
      department: 'IT',
      riskScore: 95, 
      permissions: 42, 
      excessPermissions: 15,
      lastChange: '6 hours ago',
      status: 'critical'
    },
    { 
      id: 6, 
      name: 'Priya Patel', 
      role: 'Finance Analyst', 
      department: 'Finance',
      riskScore: 82, 
      permissions: 21, 
      excessPermissions: 9,
      lastChange: 'Yesterday',
      status: 'high'
    },
  ];

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
    alert(`Opening remediation for ${user.name}\nRisk Score: ${user.riskScore}\nExcess Permissions: ${user.excessPermissions}`);
    // In real app, this would open a modal
  };

  return (
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
                      style={{ width: `${user.riskScore}%` }}
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
  );
};

export default UserTable;