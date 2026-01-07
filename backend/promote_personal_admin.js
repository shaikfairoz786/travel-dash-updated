const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'shaik.fairoz9786@gmail.com';

    const user = await prisma.user.update({
        where: { email: email },
        data: { role: 'admin' }
    });

    console.log(`Updated user ${user.name} (${user.email}) to role: ${user.role}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
