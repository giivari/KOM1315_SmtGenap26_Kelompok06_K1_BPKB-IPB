const { PrismaClient } = require('@prisma/client');

// PrismaClient diletakkan secara global agar tidak di-instansiasi ulang 
// berkali-kali pada lingkungan Serverless atau saat Hot Reload.
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
