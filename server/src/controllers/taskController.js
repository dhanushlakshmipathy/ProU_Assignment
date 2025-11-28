const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllTasks = async (req, res) => {
    try {
        let where = {};

        // If user is not ADMIN, only return tasks assigned to them
        if (req.user.role !== 'ADMIN') {
            // If for some reason req.employee is missing (e.g. data inconsistency), return empty
            if (!req.employee) {
                return res.json([]);
            }
            where = { employeeId: req.employee.id };
        }

        const tasks = await prisma.task.findMany({
            where,
            include: { employee: true },
            orderBy: { dueDate: 'asc' } // Optional: sort by due date
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        // Only Admin can create tasks
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const { title, description, status, dueDate, employeeId } = req.body;
        const task = await prisma.task.create({
            data: {
                title,
                description,
                status,
                dueDate: new Date(dueDate),
                employeeId: employeeId || null
            }
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate, employeeId } = req.body;

        // Check permissions
        if (req.user.role !== 'ADMIN') {
            // If not admin, check if task belongs to employee
            const task = await prisma.task.findUnique({ where: { id } });
            if (!task) return res.status(404).json({ error: 'Task not found' });

            if (!req.employee || task.employeeId !== req.employee.id) {
                return res.status(403).json({ error: 'Access denied. You can only edit your own tasks.' });
            }

            // Employees can only update status (and maybe description), not reassign or change due date?
            // For now, let's allow them to update everything except assignment if they own it
            // Or strictly follow "edit their own tasks only" which implies full edit rights on that task.
        }

        const task = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                employeeId: employeeId || undefined
            }
        });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        // Only Admin can delete tasks
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const { id } = req.params;
        await prisma.task.delete({
            where: { id }
        });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
