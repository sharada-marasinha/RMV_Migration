import React, { useEffect } from 'react';
import { Activity, Loader2, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCurrentNumberPlate } from '../store/numberPlateSlice';

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { current, loading, error } = useAppSelector((state) => state.numberPlate);

  useEffect(() => {
    dispatch(fetchCurrentNumberPlate());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4 border border-red-200 max-w-2xl mx-auto mt-8">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-medium">Error loading registration number</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          onClick={() => dispatch(fetchCurrentNumberPlate())}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8 lg:p-10 text-white">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Your Current Registration Number
              </h2>
              <p className="text-blue-100 mb-6 text-lg">
                Latest available registration number
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
                <div className="flex flex-col gap-3">
                  <div className="text-4xl md:text-5xl font-mono font-bold tracking-tight">
                    {current?.numberPlate || 'Unavailable'}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="bg-white/5 p-3 rounded-md">
                      <p className="text-blue-100 text-sm font-medium">Price</p>
                      <p className="text-white text-xl font-mono">
                        {current ? formatPrice(current.price) : '-'}
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-md">
                      <p className="text-blue-100 text-sm font-medium">Category</p>
                      <p className="text-white">
                        {current?.category || '-'}{' '}
                        {current?.specialCategory && `(${current.specialCategory})`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <Activity className="h-24 w-24 text-blue-200 opacity-80" />
            </div>
          </div>
        </div>

        {current && (
          <div className="bg-blue-700/50 px-6 py-3 border-t border-blue-500/30">
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <svg
                className="h-4 w-4 text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              This number is currently reserved for you
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;