import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Calendar, User, Car } from 'lucide-react';
import { registrationService } from '../services/api';
import { MotorbikeRegistration } from '../types';
import { formatPrice } from '../utils/pricing';

const RegistrationsList: React.FC = () => {
  const [registrations, setRegistrations] = useState<MotorbikeRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<MotorbikeRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<MotorbikeRegistration | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    filterRegistrations();
  }, [registrations, searchTerm, statusFilter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await registrationService.getUserRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = registrations;

    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.motorbikeMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.motorbikeModel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.status === statusFilter);
    }

    setFilteredRegistrations(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Registration Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            View and manage all motorbike registrations
          </p>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by registration number, owner, or motorbike..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        <div className="divide-y divide-gray-200">
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No registrations found</p>
            </div>
          ) : (
            filteredRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedRegistration(registration)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {registration.registrationNumber}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              registration.status
                            )}`}
                          >
                            {registration.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {registration.ownerName}
                          </div>
                          <div className="flex items-center">
                            <Car className="h-4 w-4 mr-1" />
                            {registration.motorbikeMake} {registration.motorbikeModel}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(registration.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatPrice(registration.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {registration.registrationType}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Eye className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Registration Details - {selectedRegistration.registrationNumber}
              </h3>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Owner Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.ownerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.ownerAddress}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.ownerEmail}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Motorbike Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Make & Model</label>
                      <p className="text-sm text-gray-900">
                        {selectedRegistration.motorbikeMake} {selectedRegistration.motorbikeModel}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Chassis Number</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.chassisNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Engine Number</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.engineNumber}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Payment Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Reference</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.paymentReference}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Amount Paid</label>
                      <p className="text-sm text-gray-900">{formatPrice(selectedRegistration.amountPaid)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bank</label>
                      <p className="text-sm text-gray-900">
                        {selectedRegistration.bankName} - {selectedRegistration.bankBranch}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Registration Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          selectedRegistration.status
                        )}`}
                      >
                        {selectedRegistration.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Registration Type</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.registrationType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="text-sm text-gray-900">{formatPrice(selectedRegistration.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsList;