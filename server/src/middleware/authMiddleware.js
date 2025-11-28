const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            throw new Error();
        }

        // If user is an employee, find their employee record
        let employee = null;
        if (user.role === 'EMPLOYEE') {
            employee = await prisma.employee.findUnique({ where: { email: user.email } });
        }

        req.user = user;
        req.employee = employee; // Will be null if user is ADMIN or email doesn't match
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

module.exports = authMiddleware;
