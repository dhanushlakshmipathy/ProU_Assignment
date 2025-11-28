import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            login(response.data.user, response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-bg p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border transition-colors duration-200">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-100 dark:bg-dark-border flex items-center justify-center rounded-full">
                        <UserPlus className="h-6 w-6 text-indigo-600 dark:text-dark-text-primary" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-dark-text-primary">Create your account</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-dark-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 dark:text-dark-text-primary hover:text-indigo-500 dark:hover:text-dark-text-primary/80">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-dark-text-secondary text-gray-900 dark:text-dark-text-primary rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-dark-bg"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-dark-text-secondary text-gray-900 dark:text-dark-text-primary focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-dark-bg"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-dark-text-secondary text-gray-900 dark:text-dark-text-primary focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-dark-bg"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <select
                                name="role"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-dark-text-secondary text-gray-900 dark:text-dark-text-primary rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-dark-bg"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="EMPLOYEE">Employee</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
