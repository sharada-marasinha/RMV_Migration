// src/App.tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RegistrationsList from './components/RegistrationsList';
import SpecialNumbers from './components/SpecialNumbers';
import NewRegistration from './components/NewRegistration';
import Login from './components/Login';
import Register from './components/Register';

type TabType = 'dashboard' | 'registrations' | 'special-numbers' | 'new-registration';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { isAuthenticated } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'registrations':
        return <RegistrationsList />;
      case 'special-numbers':
        return <SpecialNumbers />;
      case 'new-registration':
        return <NewRegistration />;
      default:
        const _exhaustiveCheck: never = activeTab;
        return _exhaustiveCheck;
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Layout activeTab={activeTab} onTabChange={setActiveTab}>
              {renderContent()}
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;