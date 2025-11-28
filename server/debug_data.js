const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const output = [];
    const log = (msg) => output.push(msg);

    log('--- DIAGNOSTIC REPORT ---');

    const email = 'lakshmipathydhanush@gmail.com';
    log(`Checking for email: ${email}`);

    const employee = await prisma.employee.findUnique({ where: { email } });
    if (employee) {
        log(`[OK] Employee found: ID=${employee.id}, Name="${employee.name}", Role=${employee.role}`);
    } else {
        log(`[FAIL] Employee NOT found for email: ${email}`);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        log(`[OK] User found: ID=${user.id}, Name="${user.name}", Role=${user.role}`);
    } else {
        log(`[FAIL] User NOT found for email: ${email}`);
    }

    if (employee && user) {
        if (user.role !== 'EMPLOYEE' && user.role !== 'ADMIN') {
            log(`[WARN] User role is ${user.role}, expected EMPLOYEE or ADMIN`);
        }

        const tasks = await prisma.task.findMany({ where: { employeeId: employee.id } });
        log(`[INFO] Tasks assigned to Employee ID ${employee.id}: ${tasks.length}`);
        tasks.forEach(t => log(` - Task: "${t.title}", Status=${t.status}, ID=${t.id}`));
    }

    fs.writeFileSync('debug_output.txt', output.join('\n'));
    console.log('Diagnostic report written to debug_output.txt');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
