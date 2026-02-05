import { FileText, Download, BarChart, Shield, CheckCircle } from 'lucide-react';

const ComplianceReport = () => {
  const generateReport = () => {
    // In a real app, this would call an API
    alert('✅ Compliance report generated! Download would start in a real implementation.');
    
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'compliance-report-feb-2026.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportData = {
    generatedDate: new Date().toLocaleDateString(),
    period: 'January 2026',
    totalUsers: 142,
    highRiskUsers: 8,
    anomaliesDetected: 23,
    complianceScore: 92,
    recommendations: [
      'Remove excess permissions from 8 high-risk users',
      'Review role definitions for Engineering department',
      'Implement quarterly access reviews',
      'Enable MFA for all admin accounts'
    ]
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between">
        <div className="lg:w-2/3">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold">Compliance Report Generator</h3>
          </div>
          
          <p className="text-gray-700 mb-6">
            Generate audit-ready reports for compliance officers with complete permission change history, 
            risk score evolution, and anomaly detection logs.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-500">Period</p>
              <p className="font-bold">{reportData.period}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-500">High Risk Users</p>
              <p className="font-bold text-red-600">{reportData.highRiskUsers}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-500">Compliance Score</p>
              <p className="font-bold text-green-600">{reportData.complianceScore}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-500">Anomalies</p>
              <p className="font-bold text-amber-600">{reportData.anomaliesDetected}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-bold mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Key Recommendations
            </h4>
            <ul className="space-y-2">
              {reportData.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:w-1/3 lg:pl-6 mt-6 lg:mt-0">
          <div className="bg-white rounded-lg border p-6">
            <h4 className="font-bold mb-4">Report Options</h4>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Last 30 days</option>
                  <option>Last quarter</option>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>PDF (Recommended)</option>
                  <option>CSV</option>
                  <option>JSON</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Include executive summary</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Include detailed logs</span>
                </label>
              </div>
            </div>
            
            <button 
              onClick={generateReport}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Generate & Download Report
            </button>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Report will include: Permission audit trail, Risk analysis, Compliance checklist
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReport;