import React, { useState, useEffect } from 'react';
import AuthLanding from './components/auth/AuthLanding';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/auth/RegistrationForm';
import './App.css';


function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'register', 'chat'
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);

  // Check for existing tokens on app start
  useEffect(() => {
    const savedTokens = localStorage.getItem('chatapp_tokens');
    const savedUser = localStorage.getItem('chatapp_user');
    
    if (savedTokens && savedUser) {
      try {
        setTokens(JSON.parse(savedTokens));
        setUser(JSON.parse(savedUser));
        setCurrentView('chat');
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('chatapp_tokens');
        localStorage.removeItem('chatapp_user');
      }
    }
  }, []);

  const handleChooseAuth = (authType) => {
    setCurrentView(authType);
  };

  const handleLogin = (loginData) => {
    // Store tokens and user data
    const { access_token, refresh_token, token_type, user: userData } = loginData;
    
    const tokenData = {
      access_token,
      refresh_token,
      token_type,
      expires_at: Date.now() + (60 * 60 * 1000) // 1 hour from now
    };
    
    setTokens(tokenData);
    setUser(userData);
    
    // Save to localStorage
    localStorage.setItem('chatapp_tokens', JSON.stringify(tokenData));
    localStorage.setItem('chatapp_user', JSON.stringify(userData));
    
    setCurrentView('chat');
  };

  const handleRegister = (registerData) => {
    // After successful registration, you might want to auto-login
    // or redirect to login page
    console.log('Registration successful:', registerData);
    setCurrentView('login');
  };

  const handleLogout = () => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem('chatapp_tokens');
    localStorage.removeItem('chatapp_user');
    setCurrentView('landing');
  };

  const goBack = () => {
    setCurrentView('landing');
  };

  // Token refresh function
  const refreshToken = async () => {
    if (!tokens?.refresh_token) return false;

    try {
      const response = await fetch('http://localhost:8000/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.refresh_token}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const newTokens = await response.json();
        const tokenData = {
          ...newTokens,
          expires_at: Date.now() + (60 * 60 * 1000)
        };
        
        setTokens(tokenData);
        localStorage.setItem('chatapp_tokens', JSON.stringify(tokenData));
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    return false;
  };

  // API call helper with automatic token refresh
  const apiCall = async (url, options = {}) => {
    if (!tokens?.access_token) {
      throw new Error('No access token available');
    }

    // Check if token is about to expire (5 minutes buffer)
    if (tokens.expires_at && Date.now() > tokens.expires_at - (5 * 60 * 1000)) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        handleLogout();
        throw new Error('Token refresh failed');
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    return response;
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <AuthLanding onChooseAuth={handleChooseAuth} />;
      
      case 'login':
        return (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView('register')}
            onBack={goBack}
          />
        );
      
      case 'register':
        return (
          <RegistrationForm 
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView('login')}
            onBack={goBack}
          />
        );
      
      case 'chat':
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to ChatVerse!
              </h1>
              <p className="text-gray-600 mb-6">
                Hello {user?.display_name || user?.username}! 
                Your chat app will be implemented here.
              </p>
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  <p>User ID: {user?.id}</p>
                  <p>Email: {user?.email}</p>
                  <p>Status: {user?.is_online ? 'Online' : 'Offline'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <AuthLanding onChooseAuth={handleChooseAuth} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;