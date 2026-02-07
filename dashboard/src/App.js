import { useState, useEffect } from 'react';
import { Users, ShieldAlert, Activity, FileText, Bell, Shield, RefreshCw, X, AlertCircle, Lock, User } from 'lucide-react';
import UserTable from './components/UserTable';
import AnomaliesList from './components/AnomaliesList';
import PermissionChart from './components/Charts';
import QuickActions from './components/QuickActions';
import ComplianceReport from './components/ComplianceReport';
import { api, checkBackendHealth } from './services/api';

// Landing Page Component
const LandingPage = ({ onEnter }) => {
  const [fadeOut, setFadeOut] = useState(false);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div 
      className={`landing-container ${fadeOut ? 'fade-out' : ''}`}
      onClick={handleEnter}
      style={{ 
        cursor: 'pointer',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.8s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)'
      }}></div>
      
      <div style={{
        textAlign: 'center',
        zIndex: 1,
        padding: '2rem',
        maxWidth: '800px'
      }}>
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '1.8rem',
            color: '#8a8aff',
            marginBottom: '1.5rem',
            fontWeight: 300,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            opacity: 0.9
          }}>
            Team Obsidian presents
          </h2>
          <h1 style={{
            fontSize: '5rem',
            background: 'linear-gradient(45deg, #8a8aff, #ff7ac6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '1rem 0',
            fontWeight: 700,
            letterSpacing: '1px',
            textShadow: '0 0 30px rgba(138, 138, 255, 0.3)'
          }}>
            Access_Guardian
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: '#b8b8ff',
            marginTop: '1rem',
            fontWeight: 300,
            letterSpacing: '1px'
          }}>
            We protect, so that you don't have to
          </p>
        </div>
        
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p style={{
            color: '#888',
            fontSize: '1.1rem',
            letterSpacing: '1px',
            animation: 'pulse 2s infinite'
          }}>
            Click anywhere or press any key to continue...
          </p>
        </div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .fade-out {
            opacity: 0;
          }
        `}</style>
      </div>
    </div>
  );
};

// Auth Page Component
const AuthPage = ({ onLogin }) => {
  const [isAdminLogin, setIsAdminLogin] = useState(true);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [requestData, setRequestData] = useState({
    name: '',
    email: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting login with:', adminId);
      
      // Try to connect to FastAPI backend
      const response = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: adminId,
          password: password
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login response:', data);
        
        if (data.success) {
          // Store the token and user info
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          onLogin();
        } else {
          setError(data.error || 'Invalid credentials');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('Login failed:', errorData);
        
        // Fallback to hardcoded credentials if backend is down
        if (adminId === 'admin' && password === 'admin123') {
          console.log('Using fallback credentials');
          localStorage.setItem('adminToken', 'demo_fallback_token');
          localStorage.setItem('adminUser', JSON.stringify({
            id: adminId,
            name: 'System Administrator',
            role: 'admin',
            team: 'Obsidian'
          }));
          onLogin();
        } else {
          setError(errorData.error || 'Invalid credentials. Try admin/admin123');
        }
      }
    } catch (err) {
      console.error('Login network error:', err);
      // Fallback to hardcoded credentials
      if (adminId === 'admin' && password === 'admin123') {
        localStorage.setItem('adminToken', 'demo_fallback_token');
        localStorage.setItem('adminUser', JSON.stringify({
          id: adminId,
          name: 'System Administrator',
          role: 'admin',
          team: 'Obsidian'
        }));
        onLogin();
      } else {
        setError('Backend unreachable. Using demo credentials: admin/admin123');
      }
    }
  };

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Send request access data to backend
    try {
      const response = await fetch('http://localhost:8000/api/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message || 'Access request submitted successfully!');
        setRequestData({ name: '', email: '', reason: '' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Request access error:', err);
      // For demo purposes, show success even if backend fails
      setSuccess('Access request submitted successfully! You will be notified once approved.');
      setRequestData({ name: '', email: '', reason: '' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '3.5rem',
          background: 'linear-gradient(45deg, #8a8aff, #ff7ac6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem'
        }}>
          Access_Guardian
        </h1>
        <p style={{ color: '#b8b8ff', fontSize: '1.2rem', letterSpacing: '1px' }}>
          Secure Access Management System
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        padding: '5px',
        marginBottom: '2rem'
      }}>
        <button 
          onClick={() => setIsAdminLogin(true)}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            background: isAdminLogin ? 'rgba(138, 138, 255, 0.2)' : 'transparent',
            color: isAdminLogin ? '#8a8aff' : '#aaa',
            fontSize: '1.1rem',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            flex: 1,
            fontWeight: isAdminLogin ? 600 : 400
          }}
        >
          Admin Login
        </button>
        <button 
          onClick={() => setIsAdminLogin(false)}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            background: !isAdminLogin ? 'rgba(138, 138, 255, 0.2)' : 'transparent',
            color: !isAdminLogin ? '#8a8aff' : '#aaa',
            fontSize: '1.1rem',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            flex: 1,
            fontWeight: !isAdminLogin ? 600 : 400
          }}
        >
          Request Access
        </button>
      </div>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {isAdminLogin ? (
          <form onSubmit={handleAdminLogin} style={{ width: '100%' }}>
            <h2 style={{ color: '#fff', marginBottom: '2rem', textAlign: 'center', fontSize: '1.8rem' }}>
              Admin Authentication
            </h2>
            {error && (
              <div style={{
                background: 'rgba(255, 87, 87, 0.1)',
                color: '#ff5757',
                padding: '0.8rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 87, 87, 0.2)'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="adminId" style={{
                display: 'block',
                color: '#b8b8ff',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Admin ID
              </label>
              <input
                type="text"
                id="adminId"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter admin ID"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" style={{
                display: 'block',
                color: '#b8b8ff',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            
            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(45deg, #8a8aff, #ff7ac6)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '1rem'
              }}
            >
              Login as Admin
            </button>
            
            <div style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
              <p>Demo credentials: admin / admin123</p>
              <p>Alternative: obsidian / hackathon2024</p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRequestAccess} style={{ width: '100%' }}>
            <h2 style={{ color: '#fff', marginBottom: '2rem', textAlign: 'center', fontSize: '1.8rem' }}>
              Request Access
            </h2>
            {error && (
              <div style={{
                background: 'rgba(255, 87, 87, 0.1)',
                color: '#ff5757',
                padding: '0.8rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 87, 87, 0.2)'
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                background: 'rgba(87, 255, 87, 0.1)',
                color: '#57ff57',
                padding: '0.8rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'center',
                border: '1px solid rgba(87, 255, 87, 0.2)'
              }}>
                {success}
              </div>
            )}
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="name" style={{
                display: 'block',
                color: '#b8b8ff',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={requestData.name}
                onChange={(e) => setRequestData({...requestData, name: e.target.value})}
                placeholder="Enter your full name"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="email" style={{
                display: 'block',
                color: '#b8b8ff',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={requestData.email}
                onChange={(e) => setRequestData({...requestData, email: e.target.value})}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="reason" style={{
                display: 'block',
                color: '#b8b8ff',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Reason for Access
              </label>
              <textarea
                id="reason"
                value={requestData.reason}
                onChange={(e) => setRequestData({...requestData, reason: e.target.value})}
                placeholder="Please describe why you need access"
                rows="4"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  resize: 'vertical',
                  minHeight: '100px'
                }}
              />
            </div>
            
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(45deg, #8a8aff, #ff7ac6)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '1rem'
              }}
            >
              Submit Request
            </button>
          </form>
        )}
      </div>
      
      <div style={{ marginTop: '3rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
        <p>Team Obsidian • Hackathon Project</p>
      </div>
    </div>
  );
};

// Dashboard Component (Your existing App)
const Dashboard = ({ onLogout }) => {
  const [demoMode, setDemoMode] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 142,
    high_risk_users: 8,
    anomalies_detected: 23,
    compliance_score: 92
  });
  const [anomalies, setAnomalies] = useState([]);
  
  // New state variables for QuickActions
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [allAlerts, setAllAlerts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [systemHealthResult, setSystemHealthResult] = useState(null);
  
  useEffect(() => {
    checkBackendConnection();
    if (!demoMode) {
      fetchRealData();
    }
  }, [demoMode]);
  
  const checkBackendConnection = async () => {
    try {
      const connected = await checkBackendHealth();
      setBackendConnected(connected);
      console.log(`Backend ${connected ? 'connected' : 'disconnected'}`);
    } catch (error) {
      console.error('Backend check failed:', error);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRealData = async () => {
    try {
      console.log('Fetching real data from backend...');
      const [statsData, anomaliesData] = await Promise.all([
        api.getStats(),
        api.getAnomalies()
      ]);
      setStats(statsData);
      setAnomalies(anomaliesData);
      console.log('Data fetched successfully');
    } catch (error) {
      console.error('Failed to fetch real data, switching to demo mode:', error);
      setDemoMode(true);
      // Use mock data as fallback
      setStats({
        total_users: 142,
        high_risk_users: 8,
        anomalies_detected: 23,
        compliance_score: 92
      });
      setAnomalies(await api.getMockAnomalies());
    }
  };
  
  const handleToggleDemoMode = () => {
    const newMode = !demoMode;
    setDemoMode(newMode);
    if (!newMode) {
      // If switching to real mode, fetch data
      fetchRealData();
    }
  };
  
  const handleRunSystemHealthCheck = async () => {
    try {
      if (!demoMode) {
        const result = await api.runSystemHealthCheck();
        setSystemHealthResult(result);
        
        // Show health check results
        alert(`🏥 System Health Check Results:
Status: ${result.status}
Users: ${result.metrics.total_users}
High Risk: ${result.metrics.high_risk_users}
Anomalies: ${result.metrics.anomalies_detected}
AI Accuracy: ${result.metrics.ai_model_accuracy}
${result.issues.length > 0 ? `\nIssues: ${result.issues.join(', ')}` : ''}
${result.recommendations.length > 0 ? `\nRecommendations: ${result.recommendations.join(', ')}` : ''}`);
        
        // Refresh data
        fetchRealData();
      } else {
        const mockResult = await api.runSystemHealthCheckMock();
        setSystemHealthResult(mockResult);
        alert('🔧 Demo: System health check would analyze:\n- Database connectivity\n- AI model performance\n- Risk score accuracy\n- Response times');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  
  const handleRefreshData = () => {
    if (!demoMode) {
      fetchRealData();
    }
  };

  // Handle QuickActions callbacks
  const handleQuickActionComplete = (action, data) => {
    console.log('Quick action:', action, data);
    
    switch (action) {
      case 'filter':
        // Show filtered high-risk users
        setFilteredUsers(data.users);
        alert(`✅ Showing ${data.users?.length || 0} high-risk users (risk ≥ 60)`);
        break;
      
      case 'showAlerts':
        // Show all alerts in modal
        setAllAlerts(data.anomalies || []);
        setShowAlertsModal(true);
        break;
      
      case 'refresh':
        // Refresh all data
        if (!demoMode) {
          fetchRealData();
        }
        break;
      
      default:
        console.log('Quick action completed:', action, data);
    }
  };

  // Clear filtered users
  const clearFilteredUsers = () => {
    setFilteredUsers(null);
  };

  // Role Change Demo Component
  const RoleChangeDemo = () => {
    const [selectedUser, setSelectedUser] = useState('');
    const [newRole, setNewRole] = useState('Developer');
    const [changing, setChanging] = useState(false);
    
    const users = [
      { name: 'alex.johnson', role: 'Developer' },
      { name: 'sarah.chen', role: 'HR' },
      { name: 'mike.rodriguez', role: 'Finance' },
      { name: 'emma.davis', role: 'DevOps' },
      { name: 'james.wilson', role: 'Developer' },
      { name: 'priya.patel', role: 'Finance' },
      { name: 'david.kim', role: 'HR' },
      { name: 'lisa.wang', role: 'DevOps' },
      { name: 'bot', role: 'HR' }
    ];
    
    const handleRoleChange = async () => {
      if (!selectedUser) {
        alert('Please select a user');
        return;
      }
      
      setChanging(true);
      try {
        const response = await fetch('http://localhost:8000/update-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: selectedUser,
            new_role: newRole,
            new_permissions: getPermissionsForRole(newRole)
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        alert(`✅ Role changed successfully!\n\n` +
              `User: ${result.user}\n` +
              `New Role: ${result.new_role}\n` +
              `Total Permissions: ${result.total_permissions}\n\n` +
              `🚨 Privilege Creep: User kept old permissions while gaining new ones!\n\n` +
              `Now run AI analysis to see risk score increase.`);
        
        // Refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      } catch (error) {
        console.error('Role change error:', error);
        alert(`Error: ${error.message}\n\nMake sure backend is running at http://localhost:8000`);
      } finally {
        setChanging(false);
      }
    };
    
    const getPermissionsForRole = (role) => {
      const permissions = {
        'HR': ['view_salaries', 'edit_profiles', 'onboard_users'],
        'Developer': ['access_github', 'deploy_code', 'read_logs'],
        'Finance': ['process_payments', 'view_tax_data', 'approve_expenses'],
        'DevOps': ['db_admin', 'server_root', 'manage_cloud']
      };
      return permissions[role] || [];
    };
    
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <span className="mr-2">🔄</span> Live Role Change Demo
        </h3>
        
        <p className="text-gray-700 mb-4">
          Simulate privilege creep in real-time. Change a user's role without removing old permissions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            <select 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">-- Choose User --</option>
              {users.map(user => (
                <option key={user.name} value={user.name}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Role
            </label>
            <select 
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="HR">HR</option>
              <option value="Developer">Developer</option>
              <option value="Finance">Finance</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={handleRoleChange}
              disabled={changing || !selectedUser || demoMode}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                changing || demoMode || !selectedUser
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {changing ? 'Changing Role...' : 'Simulate Role Change'}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h4 className="font-medium text-purple-800 mb-2">🎯 Demo Instructions:</h4>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-4">
            <li>Switch to <strong>Live Mode</strong> (toggle in top-right)</li>
            <li>Select <strong>"James Wilson"</strong> (already has 12 permissions)</li>
            <li>Change role to <strong>"HR"</strong></li>
            <li>Click <strong>"Simulate Role Change"</strong></li>
            <li>Watch permission count increase (12 → 15)</li>
            <li>Run <strong>"AI Risk Analysis"</strong> to see risk score increase</li>
          </ol>
        </div>
      </div>
    );
  };

  // Add connection status to navbar
  const renderConnectionStatus = () => {
    if (loading) {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded ml-2">
          Checking...
        </span>
      );
    }
    return backendConnected ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded ml-2">
        Backend Connected
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded ml-2">
        Using Demo Data
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">AccessGuardian AI</h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">Team Obsidian</span>
              {renderConnectionStatus()}
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleRefreshData}
                  className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  disabled={demoMode}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </button>
                
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={demoMode} 
                        onChange={handleToggleDemoMode} 
                      />
                      <div className={`block w-14 h-8 rounded-full ${demoMode ? 'bg-blue-600' : 'bg-green-600'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${demoMode ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium text-sm">
                      {demoMode ? 'Demo Mode' : 'Live Mode'}
                    </div>
                  </label>
                </div>
                
                {/* Logout Button */}
                <button 
                  onClick={onLogout}
                  className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm ml-2"
                >
                  <Lock className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
              
              <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-blue-600" />
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  <User className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.total_users}</p>
                <p className={`text-xs mt-1 ${demoMode ? 'text-green-600' : 'text-blue-600'}`}>
                  {demoMode ? '↑ 12 this month' : 'Live from database'}
                </p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">High Risk Users</p>
                <p className="text-3xl font-bold mt-2 text-red-600">{stats.high_risk_users}</p>
                <p className="text-xs text-red-600 mt-1">
                  {stats.high_risk_users > 5 ? 'Requires immediate action' : 'Within safe limits'}
                </p>
              </div>
              <ShieldAlert className="h-10 w-10 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Anomalies Detected</p>
                <p className="text-3xl font-bold mt-2 text-amber-600">{stats.anomalies_detected}</p>
                <p className="text-xs text-amber-600 mt-1">
                  {demoMode ? 'AI-detected threats' : 'Live AI monitoring'}
                </p>
              </div>
              <Activity className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Compliance Score</p>
                <p className="text-3xl font-bold mt-2 text-green-600">{stats.compliance_score}%</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.compliance_score > 90 ? 'A+ Security Rating' : 'Needs improvement'}
                </p>
              </div>
              <FileText className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </div>
        
        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Risk Assessment */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">User Risk Assessment</h2>
                {filteredUsers && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-600">
                      Showing {filteredUsers.length} filtered users
                    </span>
                    <button 
                      onClick={clearFilteredUsers}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </div>
              <UserTable demoMode={demoMode} filteredUsers={filteredUsers} />
            </div>
            
            {/* Permission Trend Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Permission Creep Trend</h2>
              <div className="h-80">
                <PermissionChart />
              </div>
            </div>

            {/* Compliance Report */}
            <div className="bg-white rounded-xl shadow p-6">
              <ComplianceReport />
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Recent Anomalies */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Anomalies</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  demoMode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {demoMode ? 'Demo' : 'Live'}
                </span>
              </div>
              <AnomaliesList anomalies={anomalies} demoMode={demoMode} />
              <button 
                onClick={() => {
                  if (demoMode) {
                    alert('🔍 Demo: Would show paginated anomalies view');
                  } else {
                    // For live mode, try to generate anomalies if none exist
                    if (anomalies.length === 0) {
                      fetch('http://localhost:8000/api/force-anomalies-demo', {
                        method: 'POST'
                      })
                      .then(res => res.json())
                      .then(data => {
                        alert(`Generated ${data.anomalies?.length || 0} anomalies!`);
                        window.location.reload();
                      })
                      .catch(err => {
                        console.error('Error generating anomalies:', err);
                        alert('Could not generate anomalies. Try running AI analysis first.');
                      });
                    } else {
                      handleQuickActionComplete('showAlerts', { anomalies: anomalies });
                    }
                  }
                }}
                className="w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-800 font-medium border border-dashed border-blue-200 rounded-lg"
              >
                View All Anomalies →
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <QuickActions 
                demoMode={demoMode}
                onActionComplete={handleQuickActionComplete}
              />
            </div>
            
            {/* Role Change Demo */}
            <RoleChangeDemo />
            
            {/* Compliance Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold mb-3">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">AI Monitoring</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {demoMode ? 'Demo' : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Real-time Detection</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {demoMode ? 'Simulated' : 'Enabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Data Source</span>
                  <span className="text-gray-900 font-medium">
                    {demoMode ? 'Mock Data' : 'Live Database'}
                  </span>
                </div>
                {systemHealthResult && (
                  <div className="mt-4 p-3 bg-white rounded-lg border">
                    <div className="flex items-center mb-2">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        systemHealthResult.status === 'HEALTHY' ? 'bg-green-500' :
                        systemHealthResult.status === 'WARNING' ? 'bg-yellow-500' :
                        systemHealthResult.status === 'CRITICAL' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="font-medium">Last Health Check: {systemHealthResult.status}</span>
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={handleRunSystemHealthCheck}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
              >
                <Activity className="h-5 w-5 mr-2" />
                Run System Health Check
              </button>
            </div>
          </div>
        </div>
        
        {/* Alerts Modal */}
        {showAlertsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <div>
                  <h3 className="text-xl font-bold">All System Alerts</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Showing {allAlerts.length} active alerts
                  </p>
                </div>
                <button 
                  onClick={() => setShowAlertsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {allAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">No Alerts</h4>
                    <p className="text-gray-500">No active alerts in the system.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`p-4 rounded-lg border ${
                          alert.severity === 'Critical' 
                            ? 'bg-red-50 border-red-200' 
                            : alert.severity === 'High'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium mr-3 ${
                                alert.severity === 'Critical'
                                  ? 'bg-red-100 text-red-800'
                                  : alert.severity === 'High'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.severity}
                              </span>
                              <span className="text-sm text-gray-500">{alert.time}</span>
                            </div>
                            <h4 className="font-medium mb-1">{alert.user}</h4>
                            <p className="text-gray-700 mb-2">{alert.description}</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="px-2 py-0.5 bg-gray-100 rounded mr-3">
                                {alert.system}
                              </span>
                              <span>Alert ID: #{alert.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border-t p-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Total alerts: {allAlerts.length}
                </span>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowAlertsModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      // Export alerts functionality
                      alert('Would export alerts to CSV');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Export Alerts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Demo Mode Banner */}
        {demoMode && (
          <div className="fixed bottom-4 right-4 bg-amber-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <Activity className="h-5 w-5" />
            <span>Demo Mode Active - Using mock data</span>
            <button 
              onClick={() => setDemoMode(false)}
              className="px-3 py-1 bg-white text-amber-700 rounded text-sm font-medium hover:bg-gray-100"
            >
              Switch to Live
            </button>
          </div>
        )}
        
        {/* Backend Connection Banner */}
        {!demoMode && !backendConnected && (
          <div className="fixed bottom-4 left-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <ShieldAlert className="h-5 w-5" />
            <span>Backend connection failed - Using fallback data</span>
            <button 
              onClick={checkBackendConnection}
              className="px-3 py-1 bg-white text-red-700 rounded text-sm font-medium hover:bg-gray-100"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component with Authentication
function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      // If using demo token, just accept it
      if (token === 'demo_fallback_token' || token.startsWith('demo_')) {
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
        setLoading(false);
        return;
      }
      
      // Try to validate with backend
      try {
        const response = await fetch(`http://localhost:8000/api/admin/validate?token=${token}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            setIsAuthenticated(true);
            setCurrentPage('dashboard');
          } else {
            // Token invalid, clear it
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
          }
        }
      } catch (error) {
        console.log('Backend validation failed, using local token');
        // If backend is down but we have a token, still allow access
        if (token.includes('obsidian_token')) {
          setIsAuthenticated(true);
          setCurrentPage('dashboard');
        }
      }
      
      setLoading(false);
    };
    
    validateSession();
  }, []);

  const handleLandingComplete = () => {
    setCurrentPage('auth');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #8a8aff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading Access_Guardian...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Render based on current page
  switch (currentPage) {
    case 'landing':
      return <LandingPage onEnter={handleLandingComplete} />;
    
    case 'auth':
      return <AuthPage onLogin={handleLogin} />;
    
    case 'dashboard':
      return <Dashboard onLogout={handleLogout} />;
    
    default:
      return <LandingPage onEnter={handleLandingComplete} />;
  }
}

export default App;