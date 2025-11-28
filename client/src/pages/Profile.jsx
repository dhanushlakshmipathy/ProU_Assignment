import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Shield, Save, Briefcase } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user: authUser, login } = useAuth();
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        bio: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            setUser(response.data);
            setFormData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.put('/auth/profile', formData);
            setUser(response.data);
            setFormData(response.data);
            setIsEditing(false);

            // Update local storage/context if name changed
            if (authUser) {
                login(response.data, localStorage.getItem('token'));
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        }
    };

    if (loading) return <div className="p-6 text-center dark:text-dark-text-secondary">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">My Profile</h2>
                <p className="text-gray-500 dark:text-dark-text-secondary mt-1">Manage your account settings and preferences</p>
            </div>

            <div className="bg-white dark:bg-dark-bg rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden transition-colors duration-200">
                <div className="p-8 border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-border/30">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-dark-border flex items-center justify-center text-indigo-600 dark:text-dark-text-primary text-3xl font-bold border-4 border-white dark:border-dark-bg shadow-lg">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{user?.name}</h2>
                            <p className="text-gray-500 dark:text-dark-text-secondary">{user?.email}</p>
                            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-dark-border text-indigo-800 dark:text-dark-text-primary">
                                    {user?.role}
                                </span>
                                {formData.department && (
                                    <span className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-border text-gray-800 dark:text-dark-text-secondary">
                                        <Briefcase className="w-3 h-3 mr-1" />
                                        {formData.department}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${isEditing
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-dark-border dark:text-dark-text-primary dark:hover:bg-dark-border/70'
                                }`}
                        >
                            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">Personal Information</h3>
                            {isEditing && (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData(user);
                                            setError('');
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-text-secondary bg-gray-100 dark:bg-dark-border rounded-lg hover:bg-gray-200 dark:hover:bg-dark-border/70 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-dark-border/30 dark:disabled:text-dark-text-secondary transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={user?.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-gray-50 dark:bg-dark-border/30 text-gray-500 dark:text-dark-text-secondary cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-dark-border/30 dark:disabled:text-dark-text-secondary transition-colors"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                                    Department
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-dark-border/30 dark:disabled:text-dark-text-secondary transition-colors"
                                        placeholder="Engineering"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                                    Role & Permissions
                                </label>
                                <div className="p-3 bg-indigo-50 dark:bg-dark-border/30 text-indigo-700 dark:text-dark-text-primary rounded-lg border border-indigo-100 dark:border-dark-border text-sm flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    {user.role} - {user.role === 'ADMIN' ? 'Full Access to Employee and Task Management' : 'Restricted Access (View Employees, Edit Own Tasks)'}
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    rows="4"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-dark-border/30 dark:disabled:text-dark-text-secondary transition-colors"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
