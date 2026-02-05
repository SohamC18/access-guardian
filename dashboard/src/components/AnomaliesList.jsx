import { AlertTriangle, Clock, User, Database, Server, CreditCard, FileText, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

const AnomaliesList = ({ demoMode = true, anomalies: propAnomalies }) => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnomalies();
  }, [demoMode]);

  const fetchAnomalies = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (demoMode) {
        data = await api.getMockAnomalies();
      } else {
        data = await api.getAnomalies();
      }
      setAnomalies(data);
    } catch (err) {
      console.error('Error fetching anomalies:', err);
      setError('Failed to load anomalies. Using demo data.');
      // Fallback to mock data
      const mockData = await api.getMockAnomalies();
      setAnomalies(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getSeverityIconColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'text-red-500';
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-amber-500';
      default: return 'text-blue-500';
    }
  };

  const getSystemIcon = (system) => {
    switch(system) {
      case 'Database':
      case 'Production DB':
        return <Database className="h-4 w-4" />;
      case 'Finance Portal':
        return <CreditCard className="h-4 w-4" />;
      case 'HR System':
        return <FileText className="h-4 w-4" />;
      case 'CI/CD System':
        return <Activity className="h-4 w-4" />;
      case 'Multiple Systems':
        return <Server className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  const handleTakeAction = (anomaly) => {
    alert(`Taking action on anomaly:\nUser: ${anomaly.user}\nIssue: ${anomaly.description}\n\nThis would open the remediation workflow in a real implementation.`);
  };

  const handleRefresh = () => {
    fetchAnomalies();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className="h-5 w-5 bg-gray-300 rounded mr-2"></div>
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>
            <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="h-12 bg-gray-200 rounded mb-3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (anomalies.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <AlertTriangle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-green-800 mb-1">No Anomalies Detected</h3>
          <p className="text-green-700 text-sm">
            {demoMode ? 'Demo mode: All systems normal' : 'AI monitoring active - no threats detected'}
          </p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
          >
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          Showing {anomalies.length} {demoMode ? 'demo' : 'live'} anomaly{anomalies.length !== 1 ? 'ies' : ''}
        </span>
        <button 
          onClick={handleRefresh}
          className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      {anomalies.map((anomaly) => (
        <div 
          key={anomaly.id} 
          className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer"
          onClick={() => handleTakeAction(anomaly)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <AlertTriangle className={`h-5 w-5 mr-2 ${getSeverityIconColor(anomaly.severity)}`} />
              <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(anomaly.severity)}`}>
                {anomaly.severity}
              </span>
              <div className="flex items-center ml-3 text-gray-500 text-sm">
                {getSystemIcon(anomaly.system)}
                <span className="ml-1 text-xs">{anomaly.system}</span>
              </div>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {anomaly.time}
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">{anomaly.user}</span>
          </div>
          
          <p className="text-gray-700 text-sm mb-3">{anomaly.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {demoMode ? 'Demo Data' : 'AI Model v2.1'}
            </div>
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                handleTakeAction(anomaly);
              }}
            >
              Take Action <span className="ml-1">→</span>
            </button>
          </div>
        </div>
      ))}
      
      {anomalies.length > 0 && (
        <div className="pt-4 border-t">
          <div className="flex items-center text-sm text-gray-600">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            <span>
              {demoMode 
                ? 'Demo anomalies show sample privilege creep scenarios' 
                : 'Real-time AI monitoring detects privilege accumulation patterns'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnomaliesList;