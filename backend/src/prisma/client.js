const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: 'file:./dev.db'
});

module.exports = prisma;
