// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Check if backend is available
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    return response.ok;
  } catch {
    return false;
  }
};

// Generic fetch wrapper
const apiClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
};

// API endpoints
export const api = {
  // Users
  getUsers: () => apiClient.get('/api/users'),
  
  // Dashboard stats
  getStats: () => apiClient.get('/api/stats'),
  
  // Anomalies
  getAnomalies: () => apiClient.get('/api/anomalies'),
  
  // Trigger risk calculation
  calculateRisks: () => apiClient.post('/api/calculate-risks', {}),
  
  // Remediation
  submitRemediation: (data) => apiClient.post('/remediate', {
    username: data.userId,
    permission_to_remove: data.permission
  }),
  
  // Mock data fallback
  getMockUsers: async () => {
    return [
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
  },
  
  getMockAnomalies: async () => {
    return [
      { 
        id: 1, 
        user: 'Alex Johnson', 
        description: 'Gained admin access while switching roles', 
        system: 'Database',
        time: '6h ago', 
        severity: 'High'
      },
      { 
        id: 2, 
        user: 'Mike Rodriguez', 
        description: 'Retained finance permissions after project end', 
        system: 'Finance Portal',
        time: '1d ago', 
        severity: 'Medium'
      },
      { 
        id: 3, 
        user: 'James Wilson', 
        description: '47 permissions across 6 systems', 
        system: 'Multiple Systems',
        time: '2d ago', 
        severity: 'Critical'
      },
    ];
  },
  
  getMockStats: async () => {
    return {
      total_users: 142,
      high_risk_users: 8,
      anomalies_detected: 23,
      compliance_score: 92
    };
  }
};