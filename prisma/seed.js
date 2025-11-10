const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // создадим тестовое событие
    const existing = await prisma.event.findFirst({ where: { name: 'Test Event' }});
    if (!existing) {
        const ev = await prisma.event.create({
            data: {
                name: 'Test Event',
                totalSeats: 3
            }
        });
        console.log('Created event', ev);
    } else {
        console.log('Event already exists', existing);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
