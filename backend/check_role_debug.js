const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const emails = ['admin@example.com', 'shaik.fairoz9786@gmail.com'];
    const users = await prisma.user.findMany({
        where: {
            email: { in: emails }
        },
        select: {
            id: true,
            email: true,
            role: true
        }
    });
    console.log('Target Users:');
    console.table(users);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
