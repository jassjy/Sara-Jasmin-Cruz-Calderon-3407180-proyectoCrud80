require ("dotenv").config()

const { PrismaClient } = require("../generated/prisma/client");   // Presta atención a la ruta relativa
const { PrismaPg } = require("@prisma/adapter-pg");

const adaptador = new PrismaPg({
  connectionString: process.env.DATABASE_URL="postgresql://postgres:Sena1234@localhost:5432/bd3407180?schema=public",
});

const ormPrisma = new PrismaClient({ adapter: adaptador });

module.exports = ormPrisma;

module.exports = ormPrisma