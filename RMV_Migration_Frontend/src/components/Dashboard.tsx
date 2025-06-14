import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Users, FileText } from 'lucide-react';
import { NumberPlate, MotorbikeRegistration } from '../types';
import { formatPrice } from '../utils/pricing';

import { numberPlateService } from '../services/api';

const Dashboard: React.FC = () => {
  const [currentPlate, setCurrentPlate] = useState<NumberPlate | null>(null);
  const [registrations, setRegistrations] = useState<MotorbikeRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      let data = (await numberPlateService.getCurrentNumberPlate());
      setCurrentPlate(data)

      const registrationsData = mockRegistrations;


      setRegistrations(registrationsData);

      const total = registrationsData.length;
      const pending = registrationsData.filter(r => r.status === 'PENDING').length;
      const completed = registrationsData.filter(r => r.status === 'COMPLETED').length;
      const cancelled = registrationsData.filter(r => r.status === 'CANCELLED').length;

      setStats({ total, pending, completed, cancelled });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Current Registration Number</h2>
            <p className="text-blue-100 mb-4">
              Latest ongoing normal registration number
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
              <div className="text-3xl font-mono font-bold">
                {currentPlate?.numberPlate || 'Loading...'}
              </div>
              <div className="text-sm text-blue-100 mt-1">
                Price: {currentPlate ? formatPrice(currentPlate.price) : '-'}
              </div>
            </div>
          </div>
          <Activity className="h-16 w-16 text-blue-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Registrations</h3>
        </div>
        <div className="p-6">
          {registrations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No registrations found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.slice(0, 5).map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.registrationNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.ownerName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.motorbikeMake} {registration.motorbikeModel}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(registration.totalAmount)}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${registration.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : registration.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {registration.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;