import { X, AlertCircle, Check, Shield, User, Clock, Database, Server, CreditCard, FileText, Download } from 'lucide-react';
import { useState } from 'react';

const RemediationModal = ({ isOpen, onClose, user, onSubmit, demoMode = true }) => {
  const [selectedAction, setSelectedAction] = useState('remove');
  const [justification, setJustification] = useState('');
  
  if (!isOpen || !user) return null;
  
  const excessPermissions = [
    { id: 1, name: 'finance_view_all', system: 'Finance Portal', description: 'View all financial records', risk: 'High', added: '2023-10-15' },
    { id: 2, name: 'db_admin_write', system: 'Production Database', description: 'Write access to production data', risk: 'Critical', added: '2023-09-22' },
    { id: 3, name: 'hr_salary_view', system: 'HR System', description: 'View employee salary information', risk: 'Medium', added: '2023-11-05' },
  ];
  
  const handleSubmit = () => {
    const actionData = {
      action: selectedAction,
      permission_to_remove: excessPermissions[0]?.name || 'test_permission',
      justification: justification || null,
      timestamp: new Date().toISOString()
    };
    
    if (onSubmit) {
      onSubmit(actionData);
    } else {
      alert(`Action submitted for ${user.name}\nAction: ${selectedAction}\nJustification: ${justification || 'None'}`);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold">Permission Remediation</h2>
            <p className="text-gray-600 mt-1">Review and clean up excess permissions for {user.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* User Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span>{user.role}</span>
                    <span>•</span>
                    <span>{user.department}</span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">Risk: {user.riskScore}/100</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last role change</p>
                <p className="font-medium">{user.lastChange}</p>
              </div>
            </div>
          </div>
          
          {/* AI Explanation */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-bold text-amber-800">AI Risk Analysis</h4>
                <p className="text-amber-700 mt-1">
                  User retained permissions from previous role as <span className="font-semibold">Financial Analyst</span>. 
                  Current role as <span className="font-semibold">{user.role}</span> doesn't require these access levels. 
                  This creates a violation of least-privilege principle.
                </p>
              </div>
            </div>
          </div>
          
          {/* Excess Permissions List */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Excess Permissions Detected</h3>
            <div className="space-y-3">
              {excessPermissions.map((perm) => (
                <div key={perm.id} className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {perm.system === 'Finance Portal' && <CreditCard className="h-5 w-5 text-blue-500" />}
                      {perm.system === 'Production Database' && <Database className="h-5 w-5 text-red-500" />}
                      {perm.system === 'HR System' && <FileText className="h-5 w-5 text-green-500" />}
                      <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded text-sm">{perm.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        perm.risk === 'Critical' ? 'bg-red-100 text-red-800' :
                        perm.risk === 'High' ? 'bg-red-50 text-red-700' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {perm.risk} Risk
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      Added {perm.added}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{perm.description}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Server className="h-4 w-4 mr-1" />
                    System: {perm.system}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Select Remediation Action</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setSelectedAction('remove')}
                className={`p-4 border-2 rounded-xl text-center transition-all ${selectedAction === 'remove' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <X className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <p className="font-bold">Remove All</p>
                <p className="text-sm text-gray-600 mt-1">Revoke all excess permissions</p>
              </button>
              
              <button
                onClick={() => setSelectedAction('review')}
                className={`p-4 border-2 rounded-xl text-center transition-all ${selectedAction === 'review' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="font-bold">Review Each</p>
                <p className="text-sm text-gray-600 mt-1">Manually review each permission</p>
              </button>
              
              <button
                onClick={() => setSelectedAction('keep')}
                className={`p-4 border-2 rounded-xl text-center transition-all ${selectedAction === 'keep' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="font-bold">Temporary Keep</p>
                <p className="text-sm text-gray-600 mt-1">Keep with justification & review date</p>
              </button>
            </div>
            
            {selectedAction === 'keep' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justification for keeping permissions
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Explain why these permissions should be retained..."
                />
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  This justification will be logged for compliance audit
                </div>
              </div>
            )}
          </div>
          
          {/* Impact Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-bold mb-3">Impact Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">3</p>
                <p className="text-sm text-gray-600">Excess Permissions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">85%</p>
                <p className="text-sm text-gray-600">Risk Reduction</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">1</p>
                <p className="text-sm text-gray-600">Compliance Issue Fixed</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Mode:</span> {demoMode ? 'Demo' : 'Live'} • 
            <span className="font-medium ml-2">AI Confidence:</span> 94%
          </div>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
            >
              <Check className="h-5 w-5 mr-2" />
              Submit Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemediationModal;