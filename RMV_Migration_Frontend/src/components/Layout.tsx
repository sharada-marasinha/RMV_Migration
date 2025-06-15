import React from 'react';
import { Car, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type TabType = 'dashboard' | 'registrations' | 'special-numbers' | 'new-registration';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: TabType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth(); // ✅ add logout

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Car },
    { id: 'registrations', label: 'Registrations', icon: FileText },
    { id: 'special-numbers', label: 'Special Numbers', icon: Users },
    { id: 'new-registration', label: 'New Registration', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                RMV Registration System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    <b>{user.fullName.toUpperCase()}</b>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex space-x-8 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as TabType)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
