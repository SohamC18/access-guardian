import { FileText, Search, RefreshCw, Shield, Download, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api';

const QuickActions = ({ demoMode = false, onActionComplete }) => {
  const [loading, setLoading] = useState({
    report: false,
    review: false,
    analysis: false,
    simulate: false,
    export: false,
    alerts: false
  });
  const [message, setMessage] = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleGenerateReport = async () => {
    setActiveAction('report');
    setLoading(prev => ({ ...prev, report: true }));
    try {
      if (demoMode) {
        // Create demo report
        const reportContent = `AccessGuardian AI - Compliance Report
Generated: ${new Date().toISOString()}
Report Type: MONTHLY

SUMMARY METRICS
Total Users,142
High Risk Users,8
Compliance Score,92%
AI Model Version,v2.1

HIGH RISK USERS
Username,Role,Risk Score,Excess Permissions
Alex Johnson,Senior Developer,92,8
James Wilson,System Admin,95,15
Priya Patel,Finance Analyst,82,9`;
        
        const blob = new Blob([reportContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showMessage('📄 Demo compliance report generated!', 'success');
      } else {
        const blob = await api.generateComplianceReport();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showMessage('✅ Compliance report generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      showMessage(`❌ Failed to generate report: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, report: false }));
      setActiveAction(null);
    }
  };

  const handleReviewHighRisk = async () => {
    setActiveAction('review');
    setLoading(prev => ({ ...prev, review: true }));
    try {
      if (demoMode) {
        const mockUsers = await api.getMockUsers();
        const highRiskUsers = mockUsers.filter(user => user.riskScore >= 60);
        showMessage(`🔍 Found ${highRiskUsers.length} high-risk users in demo`, 'info');
        if (onActionComplete) {
          onActionComplete('filter', { minRisk: 60, users: highRiskUsers });
        }
      } else {
        const highRiskUsers = await api.filterUsers({ minRisk: 60 });
        showMessage(`📊 Found ${highRiskUsers.length} high-risk users`, 'success');
        if (onActionComplete) {
          onActionComplete('filter', { minRisk: 60, users: highRiskUsers });
        }
      }
    } catch (error) {
      console.error('High-risk review error:', error);
      showMessage(`❌ Failed to load high-risk users: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, review: false }));
      setActiveAction(null);
    }
  };

  const handleRunRiskAnalysis = async () => {
    setActiveAction('analysis');
    setLoading(prev => ({ ...prev, analysis: true }));
    try {
      if (demoMode) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        showMessage('🧠 Demo: AI risk analysis completed. 8 new risks detected.', 'success');
        if (onActionComplete) {
          onActionComplete('refresh', {});
        }
      } else {
        await api.calculateRisks();
        showMessage('✅ AI risk analysis completed successfully!', 'success');
        if (onActionComplete) {
          onActionComplete('refresh', {});
        }
      }
    } catch (error) {
      console.error('Risk analysis error:', error);
      showMessage(`❌ Failed to run risk analysis: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
      setActiveAction(null);
    }
  };

  const handleSimulateRoleChange = async () => {
    setActiveAction('simulate');
    setLoading(prev => ({ ...prev, simulate: true }));
    try {
      if (demoMode) {
        const result = {
          message: "Simulated role change for Alex Johnson",
          details: {
            user: "Alex Johnson",
            from_role: "Senior Developer",
            to_role: "DevOps",
            permissions_added: 3,
            total_permissions_now: 27,
            excess_permissions: 9,
            risk_increase: "32%"
          },
          demonstrates: "Privilege Creep: User kept old permissions while gaining new ones"
        };
        
        showMessage(`🔄 Demo: ${result.message}`, 'info');
        alert(`🔄 ${result.message}\n\nDemonstrates: ${result.demonstrates}\n\nUser: ${result.details.user}\nFrom: ${result.details.from_role}\nTo: ${result.details.to_role}\nExcess Permissions: ${result.details.excess_permissions}`);
        if (onActionComplete) {
          onActionComplete('refresh', {});
        }
      } else {
        const result = await api.simulateRoleChange();
        showMessage(`🔄 ${result.message}`, 'success');
        alert(`🔄 ${result.message}\n\nDemonstrates: ${result.demonstrates}\n\nUser: ${result.details.user}\nFrom: ${result.details.from_role}\nTo: ${result.details.to_role}\nExcess Permissions: ${result.details.excess_permissions}`);
        if (onActionComplete) {
          onActionComplete('refresh', {});
        }
      }
    } catch (error) {
      console.error('Role simulation error:', error);
      showMessage(`❌ Failed to simulate role change: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, simulate: false }));
      setActiveAction(null);
    }
  };

  const handleExportAllData = async () => {
    setActiveAction('export');
    setLoading(prev => ({ ...prev, export: true }));
    try {
      if (demoMode) {
        // Create comprehensive demo export
        const users = await api.getMockUsers();
        const anomalies = await api.getMockAnomalies();
        const stats = await api.getMockStats();
        
        const csvContent = [
          "=== USERS ===",
          "ID,Name,Role,Department,Risk Score,Permissions,Excess Permissions,Status",
          ...users.map(u => `${u.id},${u.name},${u.role},${u.department},${u.riskScore},${u.permissions},${u.excessPermissions},${u.status}`),
          "",
          "=== ANOMALIES ===",
          "ID,User,Description,Severity,Time,System",
          ...anomalies.map(a => `${a.id},${a.user},${a.description},${a.severity},${a.time},${a.system}`),
          "",
          "=== STATISTICS ===",
          "Metric,Value",
          `Total Users,${stats.total_users}`,
          `High Risk Users,${stats.high_risk_users}`,
          `Anomalies Detected,${stats.anomalies_detected}`,
          `Compliance Score,${stats.compliance_score}%`
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `all_data_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showMessage('📊 Demo: All data exported successfully!', 'success');
      } else {
        const blob = await api.exportUsersCSV();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `all_data_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showMessage('✅ All data exported successfully!', 'success');
      }
    } catch (error) {
      console.error('Export error:', error);
      showMessage(`❌ Failed to export data: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, export: false }));
      setActiveAction(null);
    }
  };

  const handleViewAllAlerts = async () => {
    setActiveAction('alerts');
    setLoading(prev => ({ ...prev, alerts: true }));
    try {
      if (demoMode) {
        const anomalies = await api.getMockAnomalies();
        showMessage(`🚨 Demo: Showing ${anomalies.length} alerts`, 'info');
        if (onActionComplete) {
          onActionComplete('showAlerts', { anomalies });
        }
      } else {
        const data = await api.getAllAnomalies(1, 100);
        showMessage(`🚨 Showing ${data.anomalies.length} of ${data.total} alerts`, 'success');
        if (onActionComplete) {
          onActionComplete('showAlerts', data);
        }
      }
    } catch (error) {
      console.error('Alerts error:', error);
      showMessage(`❌ Failed to load alerts: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, alerts: false }));
      setActiveAction(null);
    }
  };

  const actions = [
    { 
      id: 'report',
      label: 'Generate Compliance Report', 
      icon: FileText, 
      color: 'bg-green-100 text-green-800 border-green-200',
      hoverColor: 'hover:bg-green-50',
      description: 'PDF audit report',
      onClick: handleGenerateReport,
      loading: loading.report
    },
    { 
      id: 'review',
      label: 'Review High-Risk Users', 
      icon: Search, 
      color: 'bg-red-100 text-red-800 border-red-200',
      hoverColor: 'hover:bg-red-50',
      description: '8 users need attention',
      onClick: handleReviewHighRisk,
      loading: loading.review
    },
    { 
      id: 'analysis',
      label: 'Run Risk Analysis', 
      icon: Shield, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      hoverColor: 'hover:bg-blue-50',
      description: 'AI-powered scan',
      onClick: handleRunRiskAnalysis,
      loading: loading.analysis
    },
    { 
      id: 'simulate',
      label: 'Simulate Role Change', 
      icon: RefreshCw, 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      hoverColor: 'hover:bg-purple-50',
      description: 'Test permission cleanup',
      onClick: handleSimulateRoleChange,
      loading: loading.simulate
    },
    { 
      id: 'export',
      label: 'Export All Data', 
      icon: Download, 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      hoverColor: 'hover:bg-gray-50',
      description: 'CSV format',
      onClick: handleExportAllData,
      loading: loading.export
    },
    { 
      id: 'alerts',
      label: 'View All Alerts', 
      icon: AlertCircle, 
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      hoverColor: 'hover:bg-amber-50',
      description: '23 active alerts',
      onClick: handleViewAllAlerts,
      loading: loading.alerts
    },
  ];

  return (
    <div className="relative">
      {/* Status Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : message.type === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.type === 'success' && <CheckCircle className="h-4 w-4 mr-2" />}
          {message.type === 'error' && <XCircle className="h-4 w-4 mr-2" />}
          {message.type === 'info' && <AlertCircle className="h-4 w-4 mr-2" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          const isLoading = action.loading;
          const isActive = activeAction === action.id;
          
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={isLoading}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
              } ${action.color} ${action.hoverColor} ${
                isActive ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
            >
              <div className="mb-3 relative">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : (
                  <Icon className="h-5 w-5" />
                )}
                {isLoading && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="h-1 w-8 bg-current opacity-20 rounded-full overflow-hidden">
                      <div className="h-full bg-current animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
              </div>
              <span className={`font-medium mb-1 ${isLoading ? 'opacity-70' : ''}`}>
                {action.label}
              </span>
              <span className={`text-xs opacity-75 ${isLoading ? 'opacity-50' : ''}`}>
                {action.description}
              </span>
              
              {isLoading && (
                <div className="mt-2 text-xs opacity-60">
                  Processing...
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mode Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 ${demoMode ? 'bg-amber-500' : 'bg-green-500'}`}></div>
            <span className="text-gray-600">
              {demoMode ? 'Demo Mode' : 'Live Backend'}
            </span>
          </div>
          <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
            {demoMode ? 'Using Mock Data' : 'Connected to API'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;