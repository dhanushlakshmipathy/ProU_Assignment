import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, Briefcase } from 'lucide-react';
import axios from 'axios';
import Modal from '../components/Modal';
import EmployeeForm from '../components/EmployeeForm';
import { useAuth } from '../context/AuthContext';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employees');
            setEmployees(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`http://localhost:5000/api/employees/${id}`);
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-6 text-center dark:text-dark-text-secondary">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Employees</h2>
                    <p className="text-gray-500 dark:text-dark-text-secondary mt-1">Manage your team members</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-dark-bg rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden transition-colors duration-200">
                <div className="p-4 border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-border/30 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-dark-border/30 text-gray-600 dark:text-dark-text-secondary font-medium border-b border-gray-200 dark:border-dark-border">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Role & Dept</th>
                                {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-dark-border flex items-center justify-center text-indigo-600 dark:text-dark-text-primary font-bold mr-3">
                                                {employee.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-dark-text-primary">{employee.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-gray-500 dark:text-dark-text-secondary">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {employee.email}
                                            </div>
                                            <div className="flex items-center text-gray-500 dark:text-dark-text-secondary">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {employee.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="font-medium text-gray-900 dark:text-dark-text-primary">{employee.role}</div>
                                            <div className="flex items-center text-gray-500 dark:text-dark-text-secondary">
                                                <Briefcase className="w-4 h-4 mr-2" />
                                                {employee.department}
                                            </div>
                                        </div>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(employee.id)}
                                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Employee"
            >
                <EmployeeForm
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchEmployees}
                />
            </Modal>
        </div>
    );
};

export default EmployeeList;
