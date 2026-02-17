
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import { pathToFileURL } from 'url';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const dbPath = path.resolve(process.cwd(), 'dev.db');
let url = process.env.DATABASE_URL;
if (!url || url.startsWith('file:')) {
    url = pathToFileURL(dbPath).href;
}

console.log('Prisma LibSQL URL:', url);

const adapter = new PrismaLibSql({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: ['query'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
