import { FileText, Search, RefreshCw, Shield, Download, AlertCircle } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { 
      label: 'Generate Compliance Report', 
      icon: <FileText className="h-5 w-5" />, 
      color: 'bg-green-100 text-green-800 border-green-200',
      hoverColor: 'hover:bg-green-50',
      description: 'PDF audit report'
    },
    { 
      label: 'Review High-Risk Users', 
      icon: <Search className="h-5 w-5" />, 
      color: 'bg-red-100 text-red-800 border-red-200',
      hoverColor: 'hover:bg-red-50',
      description: '8 users need attention'
    },
    { 
      label: 'Run Risk Analysis', 
      icon: <Shield className="h-5 w-5" />, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      hoverColor: 'hover:bg-blue-50',
      description: 'AI-powered scan'
    },
    { 
      label: 'Simulate Role Change', 
      icon: <RefreshCw className="h-5 w-5" />, 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      hoverColor: 'hover:bg-purple-50',
      description: 'Test permission cleanup'
    },
    { 
      label: 'Export All Data', 
      icon: <Download className="h-5 w-5" />, 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      hoverColor: 'hover:bg-gray-50',
      description: 'CSV format'
    },
    { 
      label: 'View All Alerts', 
      icon: <AlertCircle className="h-5 w-5" />, 
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      hoverColor: 'hover:bg-amber-50',
      description: '23 active alerts'
    },
  ];

  const handleAction = (label) => {
    alert(`Action: ${label}\n\nThis would trigger the actual functionality in a real implementation.`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => handleAction(action.label)}
          className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] ${action.color} ${action.hoverColor}`}
        >
          <div className="mb-3">
            {action.icon}
          </div>
          <span className="font-medium mb-1">{action.label}</span>
          <span className="text-xs opacity-75">{action.description}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;    