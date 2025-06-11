import React, { useState, useEffect } from 'react';
import { Search, Clock, Lock, Star, Zap } from 'lucide-react';
import { registrationService } from '../services/api';
import { RegistrationNumber } from '../types';
import { formatPrice, getCategoryLabel, getCategoryBadgeColor } from '../utils/pricing';

const SpecialNumbers: React.FC = () => {
  const [specialNumbers, setSpecialNumbers] = useState<RegistrationNumber[]>([]);
  const [filteredNumbers, setFilteredNumbers] = useState<RegistrationNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lockedNumber, setLockedNumber] = useState<string | null>(null);
  const [lockTimer, setLockTimer] = useState<number | null>(null);

  useEffect(() => {
    fetchSpecialNumbers();
  }, []);

  useEffect(() => {
    filterNumbers();
  }, [specialNumbers, searchTerm, categoryFilter]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockTimer && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev && prev <= 1) {
            setLockedNumber(null);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lockTimer]);

  const fetchSpecialNumbers = async () => {
    try {
      setLoading(true);
      const data = await registrationService.getAvailableSpecialNumbers();
      setSpecialNumbers(data);
    } catch (error) {
      console.error('Error fetching special numbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNumbers = () => {
    let filtered = specialNumbers;

    if (searchTerm) {
      filtered = filtered.filter((number) =>
        number.number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((number) => number.category === categoryFilter);
    }

    setFilteredNumbers(filtered);
  };

  const lockNumber = async (number: string) => {
    try {
      await registrationService.lockSpecialNumber(number);
      console.log(number);

      setLockedNumber(number);
      setLockTimer(30 * 60);



      setSpecialNumbers((prev) =>
        prev.map((n) =>
          n.number === number
            ? { ...n, locked: true, lockExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() }
            : n
        )
      );
    } catch (error) {
      console.error('Error locking number:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MILESTONE':
        return <Star className="h-4 w-4" />;
      case 'CHARACTER_BUMP':
        return <Zap className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
          <h2 className="text-xl font-semibold text-gray-900">Special Registration Numbers</h2>
          <p className="text-sm text-gray-600 mt-1">
            Search and reserve special registration numbers with premium pricing
          </p>
        </div>

        {/* Lock Status */}
        {lockedNumber && lockTimer && (
          <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">
                  Number {lockedNumber} is locked for you
                </span>
              </div>
              <div className="flex items-center text-sm text-yellow-700">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(lockTimer)} remaining
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by number (e.g., ABC-1234)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="MILESTONE">Milestone Numbers</option>
                <option value="ONE_REPETITION">One Repetition</option>
                <option value="TWO_REPETITIONS">Two Repetitions</option>
                <option value="FULL_REPETITION">Full Repetition</option>
                <option value="CHARACTER_BUMP">Character Bump</option>
              </select>
            </div>
          </div>
        </div>

        {/* Numbers Grid */}
        <div className="p-6">
          {filteredNumbers.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No special numbers found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNumbers.map((number) => (
                <div
                  key={number.id}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${number.locked
                      ? 'border-red-200 bg-red-50'
                      : number.available
                        ? 'border-green-200 bg-green-50 hover:border-green-300'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {getCategoryIcon(number.category)}
                      <span className="ml-2 text-lg font-mono font-bold text-gray-900">
                        {number.number}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeColor(
                        number.category
                      )}`}
                    >
                      {getCategoryLabel(number.category)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-xl font-bold text-gray-900">
                      {formatPrice(number.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {number.category === 'NORMAL' ? 'Standard Rate' : 'Premium Rate'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {number.locked ? (
                      <div className="flex items-center text-sm text-red-600">
                        <Lock className="h-4 w-4 mr-1" />
                        {number.number === lockedNumber ? 'Locked by you' : 'Locked by another user'}
                      </div>
                    ) : number.available ? (
                      <button
                        onClick={() => lockNumber(number.number)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Reserve for 30 minutes
                      </button>
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-2">
                        Not Available
                      </div>
                    )}
                  </div>

                  {number.locked && number.lockExpiresAt && (
                    <div className="mt-2 text-xs text-gray-500">
                      Expires: {new Date(number.lockExpiresAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Explanation */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Special Number Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Milestone Numbers</h4>
            <p className="text-blue-700 mb-2">Round numbers like ABC-1000, ABC-2000</p>
            <p className="text-blue-600">Price: {formatPrice(10000)}</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">One Repetition</h4>
            <p className="text-blue-700 mb-2">Numbers like ABC-1100, ABC-2200</p>
            <p className="text-blue-600">Price: {formatPrice(20000)}</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Two Repetitions</h4>
            <p className="text-blue-700 mb-2">Numbers like ABC-1110, ABC-2220</p>
            <p className="text-blue-600">Price: {formatPrice(30000)}</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Full Repetition</h4>
            <p className="text-blue-700 mb-2">Numbers like ABC-1111, ABC-2222</p>
            <p className="text-blue-600">Price: {formatPrice(50000)}</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-medium text-blue-800 mb-2">Character Bump</h4>
            <p className="text-blue-700 mb-2">Sequential letters like AAA-1234, AAB-1234</p>
            <p className="text-blue-600">Price: {formatPrice(100000)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialNumbers;