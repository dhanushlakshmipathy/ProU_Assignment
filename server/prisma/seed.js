const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    console.log('Start seeding ...');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@prou.com' },
        update: {},
        create: {
            email: 'admin@prou.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });
    console.log(`Created admin user: ${admin.email}`);

    // Create Employee User
    const employeePassword = await bcrypt.hash('employee123', 10);
    const employeeUser = await prisma.user.upsert({
        where: { email: 'john@prou.com' },
        update: {},
        create: {
            email: 'john@prou.com',
            password: employeePassword,
            name: 'John Doe',
            role: 'EMPLOYEE',
        },
    });
    console.log(`Created employee user: ${employeeUser.email}`);

    // Create Employee Profile
    const employeeProfile = await prisma.employee.upsert({
        where: { email: 'john@prou.com' },
        update: {},
        create: {
            name: 'John Doe',
            email: 'john@prou.com',
            phone: '123-456-7890',
            department: 'Engineering',
            role: 'Developer',
        },
    });
    console.log(`Created employee profile: ${employeeProfile.name}`);

    // Create Tasks
    const task1 = await prisma.task.create({
        data: {
            title: 'Fix Login Bug',
            description: 'Investigate and fix the issue with login on mobile devices.',
            status: 'IN_PROGRESS',
            dueDate: new Date('2023-12-31'),
            employeeId: employeeProfile.id,
        },
    });

    const task2 = await prisma.task.create({
        data: {
            title: 'Update Documentation',
            description: 'Update the API documentation for the new endpoints.',
            status: 'TODO',
            dueDate: new Date('2024-01-15'),
            employeeId: employeeProfile.id,
        },
    });

    console.log(`Created tasks: ${task1.title}, ${task2.title}`);
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
