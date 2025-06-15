import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaSignInAlt, FaCar } from 'react-icons/fa';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8082/api/auth/register', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            navigate('/login');
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Registration failed');
            } else {
                setError('An error occurred during registration');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-800 py-6 px-8 text-center">
                        <div className="flex items-center justify-center space-x-3">
                            <FaCar className="text-white text-3xl" />
                            <h1 className="text-2xl font-bold text-white">RMV Plate System</h1>
                        </div>
                        <p className="mt-2 text-blue-200">Create your account</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaIdCard className="text-gray-400" />
                                </div>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={6}
                                />
                                <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <FaSignInAlt className="mr-2" />
                                        Register
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-4 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <a
                                href="/login"
                                className="font-medium text-blue-600 hover:text-blue-500"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/login');
                                }}
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-white">
                    <p>© {new Date().getFullYear()} RMV Plate System. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Register;