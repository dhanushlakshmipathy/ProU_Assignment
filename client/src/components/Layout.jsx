import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/employees', icon: Users, label: 'Employees' },
        { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-dark-bg border-r border-gray-200 dark:border-dark-border flex flex-col transition-colors duration-200">
                <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-dark-text-primary">ProU</h1>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Management System</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-50 dark:bg-dark-border text-indigo-600 dark:text-dark-text-primary'
                                    : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border/50'
                                    }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-dark-border">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-dark-border flex items-center justify-center text-indigo-600 dark:text-dark-text-primary font-bold mr-3">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 dark:text-dark-text-primary truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 dark:text-dark-text-secondary truncate w-32">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={toggleTheme}
                            className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
