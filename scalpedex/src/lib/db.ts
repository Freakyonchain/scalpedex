import { PrismaClient } from '@prisma/client'

// Cette déclaration nous aide à éviter la création de multiples instances
// de Prisma Client pendant le développement avec le Hot Reload
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Si une instance de Prisma existe déjà globalement, on l'utilise
// Sinon, on en crée une nouvelle
export const prisma = globalForPrisma.prisma || new PrismaClient()

// En développement, on sauvegarde l'instance pour la réutiliser
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma