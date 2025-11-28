import React, { useState, useEffect } from 'react';
import api from '../lib/api';

const TaskForm = ({ onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'TODO',
        dueDate: '',
        employeeId: ''
    });
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get('/employees');
                setEmployees(response.data);
            } catch (err) {
                console.error('Failed to fetch employees for dropdown', err);
            }
        };
        fetchEmployees();

        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                status: initialData.status,
                dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
                employeeId: initialData.employeeId || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (initialData) {
                await api.put(`/tasks/${initialData.id}`, formData);
            } else {
                await api.post('/tasks', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || `Failed to ${initialData ? 'update' : 'create'} task`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Task Title</label>
                <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Fix Login Bug"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Description</label>
                <textarea
                    name="description"
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the task..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Status</label>
                    <select
                        name="status"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Assign To (Optional)</label>
                <select
                    name="employeeId"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary"
                    value={formData.employeeId}
                    onChange={handleChange}
                >
                    <option value="">Unassigned</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Task' : 'Create Task')}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
