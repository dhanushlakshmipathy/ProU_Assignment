import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import api from '../lib/api';

const StatCard = ({ icon: Icon, label, value, color, subValue }) => (
    <div className="bg-white dark:bg-dark-bg p-6 rounded-xl shadow-sm border border-gray-200 dark:border-dark-border transition-colors duration-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mt-1">{value}</p>
                {subValue && <p className="text-xs text-gray-400 dark:text-dark-text-secondary mt-1">{subValue}</p>}
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0
    });
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, taskRes] = await Promise.all([
                    api.get('/employees'),
                    api.get('/tasks')
                ]);

                const empData = empRes.data;
                const taskData = taskRes.data;

                setEmployees(empData);
                setTasks(taskData);

                setStats({
                    totalEmployees: empData.length,
                    totalTasks: taskData.length,
                    pendingTasks: taskData.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length,
                    completedTasks: taskData.filter(t => t.status === 'DONE').length
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center dark:text-dark-text-secondary">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Dashboard Overview</h2>
                <p className="text-gray-500 dark:text-dark-text-secondary mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Employees"
                    value={stats.totalEmployees}
                    color="bg-blue-500"
                    subValue="Active team members"
                />
                <StatCard
                    icon={CheckSquare}
                    label="Total Tasks"
                    value={stats.totalTasks}
                    color="bg-indigo-500"
                    subValue="All time tasks"
                />
                <StatCard
                    icon={Clock}
                    label="Pending Tasks"
                    value={stats.pendingTasks}
                    color="bg-amber-500"
                    subValue="Needs attention"
                />
                <StatCard
                    icon={AlertCircle}
                    label="Completed Tasks"
                    value={stats.completedTasks}
                    color="bg-emerald-500"
                    subValue="Successfully finished"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-dark-bg p-6 rounded-xl shadow-sm border border-gray-200 dark:border-dark-border transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4">Recent Tasks</h3>
                    <div className="space-y-4">
                        {tasks.slice(0, 5).map(task => (
                            <div key={task.id || task._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-border/30 rounded-lg transition-colors duration-200">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-dark-text-primary">{task.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${task.status === 'DONE' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                                        'bg-gray-200 dark:bg-dark-border text-gray-800 dark:text-dark-text-secondary'
                                    }`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                        {tasks.length === 0 && <p className="text-gray-500 dark:text-dark-text-secondary text-sm">No tasks found.</p>}
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-bg p-6 rounded-xl shadow-sm border border-gray-200 dark:border-dark-border transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4">Team Members</h3>
                    <div className="space-y-4">
                        {employees.slice(0, 5).map(emp => (
                            <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-border/30 rounded-lg transition-colors duration-200">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-dark-border flex items-center justify-center text-indigo-600 dark:text-dark-text-primary font-bold mr-3">
                                        {emp.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-dark-text-primary">{emp.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-dark-text-secondary">{emp.role}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-dark-text-secondary">{emp.department}</span>
                            </div>
                        ))}
                        {employees.length === 0 && <p className="text-gray-500 dark:text-dark-text-secondary text-sm">No employees found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
