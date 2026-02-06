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
  // ============= EXISTING ENDPOINTS =============
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
  
  // ============= NEW ENDPOINTS =============
  // Export users to CSV
  exportUsersCSV: async () => {
    const response = await fetch(`${API_BASE_URL}/api/export/users`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.blob(); // Returns file blob
  },
  
  // Filter users by criteria
  filterUsers: async (criteria) => {
    const response = await fetch(`${API_BASE_URL}/api/users/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criteria)
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
  
  // Get all anomalies (paginated)
  getAllAnomalies: async (page = 1, limit = 50) => {
    const response = await fetch(`${API_BASE_URL}/api/anomalies/all?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
  
  // System health check
  runSystemHealthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/api/system/health-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
  
  // Quick Actions - Compliance Report
  generateComplianceReport: async (type = 'monthly') => {
    const response = await fetch(`${API_BASE_URL}/api/reports/compliance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.blob(); // PDF file
  },
  
  // Quick Actions - Simulate Role Change
  simulateRoleChange: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/simulate/role-change`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {})
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
  
  // ============= DEMO/MOCK MODE =============
  // Check if backend is running
  isBackendAvailable: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch (error) {
      console.log('Backend not available, using demo mode:', error.message);
      return false;
    }
  },
  
  // Mock data fallback (for demo mode)
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
        status: 'critical'
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
        status: 'high'
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
        status: 'medium'
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
  },
  
  // Mock versions of new endpoints for demo mode
  exportUsersCSVMock: async () => {
    // Create a CSV string
    const users = await api.getMockUsers();
    const csvContent = [
      ['ID', 'Name', 'Role', 'Department', 'Risk Score', 'Permissions', 'Excess Permissions', 'Status', 'Last Change'],
      ...users.map(user => [
        user.id,
        user.name,
        user.role,
        user.department,
        user.riskScore,
        user.permissions,
        user.excessPermissions,
        user.status,
        user.lastChange
      ])
    ].map(row => row.join(',')).join('\n');
    
    // Convert to blob
    return new Blob([csvContent], { type: 'text/csv' });
  },
  
  filterUsersMock: async (criteria) => {
    const users = await api.getMockUsers();
    return users.filter(user => {
      if (criteria.minRisk && user.riskScore < criteria.minRisk) return false;
      if (criteria.maxRisk && user.riskScore > criteria.maxRisk) return false;
      if (criteria.status && user.status !== criteria.status) return false;
      if (criteria.role && user.role !== criteria.role) return false;
      return true;
    });
  },
  
  runSystemHealthCheckMock: async () => {
    return {
      status: "HEALTHY",
      timestamp: new Date().toISOString(),
      metrics: {
        total_users: 142,
        high_risk_users: 8,
        anomalies_detected: 23,
        ai_model_accuracy: "94.2%",
        response_time_ms: 45
      },
      issues: [],
      recommendations: [
        "Schedule weekly audit",
        "Review high-risk users"
      ]
    };
  },
  
  generateComplianceReportMock: async () => {
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
    
    return new Blob([reportContent], { type: 'text/csv' });
  },
  
  simulateRoleChangeMock: async () => {
    return {
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
  }
};