const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: { tasks: true }
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await prisma.employee.findUnique({
            where: { id },
            include: { tasks: true }
        });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        // Only Admin can create employees
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const { name, email, phone, department, role } = req.body;
        const employee = await prisma.employee.create({
            data: { name, email, phone, department, role }
        });
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        // Only Admin can update employees
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const { id } = req.params;
        const { name, email, phone, department, role } = req.body;
        const employee = await prisma.employee.update({
            where: { id },
            data: { name, email, phone, department, role }
        });
        res.json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        // Only Admin can delete employees
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const { id } = req.params;
        await prisma.employee.delete({
            where: { id }
        });
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
