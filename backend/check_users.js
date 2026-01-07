const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            email: { contains: 'shaik' }
        },
        select: {
            email: true,
            role: true
        }
    });
    console.log('Matching Users:');
    users.forEach(u => console.log(`EMAIL: ${u.email} | ROLE: ${u.role}`));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
