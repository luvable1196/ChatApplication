import React, { useState, useEffect } from 'react';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import AuthContainer from './components/auth/AuthContainer';
import ChatApp from './components/chat/ChatApp';

// API Configuration - Replace with your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

const App = () => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (e.g., from session/token)
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Replace with your auth check endpoint
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      console.log('No active session');
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <AuthContainer user={user} onLogout={handleLogout}>
      {!user ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          {isLogin ? (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={() => setIsLogin(false)}
              loading={loading}
            />
          ) : (
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => setIsLogin(true)}
              loading={loading}
            />
          )}
        </div>
      ) : (
        <ChatApp user={user} />
      )}
    </AuthContainer>
  );
};

export default App;