import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.trim() === '') {
    throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
        { email: 'alice@example.com', password: hashedPassword },
        { email: 'bob@example.com', password: hashedPassword },
        { email: 'charlie@example.com', password: hashedPassword },
    ];

    for (const u of users) {
        const existingUser = await prisma.user.findUnique({
            where: { email: u.email },
        });
        if (!existingUser) {
            const user = await prisma.user.create({ data: u });
            await prisma.account.createMany({
                data: [
                    { userId: user.id, currency: 'USD', balance: 1000 },
                    { userId: user.id, currency: 'EUR', balance: 500 },
                ],
            });
        }
    }

    console.log('✅ Seeding completed.');
}

(async () => {
    try {
        await main();
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Seeding error:', err.message);
        } else {
            console.error('Unexpected error:', err);
        }
    } finally {
        await prisma.$disconnect();
    }
})();
