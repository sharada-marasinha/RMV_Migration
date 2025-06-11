import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RegistrationsList from './components/RegistrationsList';
import SpecialNumbers from './components/SpecialNumbers';
import NewRegistration from './components/NewRegistration';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;