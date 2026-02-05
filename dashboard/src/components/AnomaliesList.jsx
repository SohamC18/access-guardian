import { AlertTriangle, Clock, User, Database, Server, CreditCard } from 'lucide-react';

const AnomaliesList = () => {
  const anomalies = [
    { 
      id: 1, 
      user: 'Alex Johnson', 
      description: 'Gained admin access while switching from Financial Analyst to Developer role', 
      system: 'Database',
      time: '6h ago', 
      severity: 'High',
      icon: <Database className="h-4 w-4" />
    },
    { 
      id: 2, 
      user: 'Mike Rodriguez', 
      description: 'Retained finance permissions 30 days after project completion', 
      system: 'Finance Portal',
      time: '1d ago', 
      severity: 'Medium',
      icon: <CreditCard className="h-4 w-4" />
    },
    { 
      id: 3, 
      user: 'James Wilson', 
      description: '47 permissions across 6 systems (above 95th percentile)', 
      system: 'Multiple Systems',
      time: '2d ago', 
      severity: 'Critical',
      icon: <Server className="h-4 w-4" />
    },
    { 
      id: 4, 
      user: 'Priya Patel', 
      description: 'Access to production data without proper clearance', 
      system: 'Production DB',
      time: '4h ago', 
      severity: 'High',
      icon: <Database className="h-4 w-4" />
    },
  ];

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

  return (
    <div className="space-y-4">
      {anomalies.map((anomaly) => (
        <div 
          key={anomaly.id} 
          className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <AlertTriangle className={`h-5 w-5 mr-2 ${getSeverityIconColor(anomaly.severity)}`} />
              <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(anomaly.severity)}`}>
                {anomaly.severity}
              </span>
              <div className="flex items-center ml-3 text-gray-500 text-sm">
                {anomaly.icon}
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
              Detected by AI Model v2.1
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              Take Action <span className="ml-1">→</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnomaliesList;