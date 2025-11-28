const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'EMPLOYEE'
            }
        });

        // Generate token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

        // Find associated employee record if applicable
        let employeeId = null;
        if (user.role === 'EMPLOYEE') {
            const employee = await prisma.employee.findUnique({ where: { email: user.email } });
            if (employee) {
                employeeId = employee.id;
            }
        }

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                employeeId // Include linked employee ID
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                department: true,
                bio: true
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, department, bio } = req.body;

        // Update User record
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { name, phone, department, bio },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                department: true,
                bio: true
            }
        });

        // If user is an employee, try to sync with Employee record
        if (req.user.role === 'EMPLOYEE') {
            const employee = await prisma.employee.findUnique({ where: { email: req.user.email } });
            if (employee) {
                await prisma.employee.update({
                    where: { id: employee.id },
                    data: {
                        name: name || employee.name,
                        phone: phone || employee.phone,
                        department: department || employee.department
                    }
                });
            }
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
