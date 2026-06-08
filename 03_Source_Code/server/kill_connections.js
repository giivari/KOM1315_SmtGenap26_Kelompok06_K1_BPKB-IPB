const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function killOtherConnections() {
  try {
    console.log('Attempting to kill all other connections on Supabase...');
    const result = await prisma.$executeRawUnsafe(`
      SELECT pg_terminate_backend(pid) 
      FROM pg_stat_activity 
      WHERE datname = current_database() 
      AND pid <> pg_backend_pid();
    `);
    console.log('Killed other connections:', result);
  } catch (error) {
    console.error('Failed to kill connections:', error);
  } finally {
    await prisma.$disconnect();
  }
}

killOtherConnections();
