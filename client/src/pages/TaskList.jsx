import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, User } from 'lucide-react';
import axios from 'axios';
import { cn } from '../lib/utils';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks');
            setTasks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleAddTask = () => {
        setEditingTask(null);
        handleOpenModal();
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        handleOpenModal();
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`http://localhost:5000/api/tasks/${id}`);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <div className="p-6 text-center dark:text-dark-text-secondary">Loading tasks...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-dark-text-primary">Task List</h1>

            <div className="flex justify-between items-center mb-6">
                <div className="relative flex-grow mr-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-primary placeholder-gray-500 dark:placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {isAdmin && (
                    <button
                        onClick={handleAddTask}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Task
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-dark-bg shadow-md rounded-lg p-4 border border-gray-200 dark:border-dark-border transition-colors duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => {
                            const canEdit = isAdmin || (user?.employeeId && task.employeeId === user.employeeId);

                            return (
                                <div key={task.id || task._id} className="bg-gray-50 dark:bg-dark-border/30 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border flex flex-col justify-between transition-colors duration-200">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-2">{task.title}</h3>
                                        <p className="text-gray-600 dark:text-dark-text-secondary mb-4">{task.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-dark-text-secondary mt-auto pt-4 border-t border-gray-100 dark:border-dark-border">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center" title="Assignee">
                                                <User className="w-4 h-4 mr-1.5" />
                                                {task.employee ? task.employee.name : 'Unassigned'}
                                            </div>
                                            <div className="flex items-center" title="Due Date">
                                                <Calendar className="w-4 h-4 mr-1.5" />
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            {canEdit && (
                                                <button
                                                    onClick={() => handleEditTask(task)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                    title="Edit Task"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                            )}
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteTask(task.id || task._id)}
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                    title="Delete Task"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-8 text-center text-gray-500 dark:text-dark-text-secondary">
                            No tasks found.
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTask ? "Edit Task" : "Create New Task"}
            >
                <TaskForm
                    onClose={handleCloseModal}
                    onSuccess={fetchTasks}
                    initialData={editingTask}
                />
            </Modal>
        </div>
    );
};

export default TaskList;
