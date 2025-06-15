import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCar, FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8082/api/auth/login', {
                username,
                password
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const { data } = response;
            if (response.status === 200) {
                login({
                    userId: data.userId,
                    username: data.username,
                    fullName: data.fullName,
                    token: data.token,
                    role: data.role
                });
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Login failed');
            } else {
                setError('An error occurred during login');
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
                        <p className="mt-2 text-blue-200">Vehicle Registration Management</p>
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
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
                                        autoComplete="current-password"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                        Forgot password?
                                    </a>
                                </div>
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
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaSignInAlt className="mr-2" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-4 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a
                                href="/register"
                                className="font-medium text-blue-600 hover:text-blue-500"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/register');
                                }}
                            >
                                Register here
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

export default Login;