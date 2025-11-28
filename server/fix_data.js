const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fixing user roles...');

    // Find users with invalid roles (not ADMIN or EMPLOYEE)
    const users = await prisma.user.findMany({
        where: {
            role: {
                notIn: ['ADMIN', 'EMPLOYEE']
            }
        }
    });

    console.log(`Found ${users.length} users with invalid roles.`);

    for (const user of users) {
        console.log(`Fixing user: ${user.name} (${user.email}) - Current Role: ${user.role}`);
        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'EMPLOYEE' }
        });
        console.log(`Updated role to EMPLOYEE`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
