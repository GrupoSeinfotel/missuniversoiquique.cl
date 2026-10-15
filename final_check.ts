import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function checkPoints() {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { fullName: { contains: 'Yessamin' } }
    });
    if (candidate) {
        console.log(`Candidata: ${candidate.fullName}`);
        console.log(`Puntos actuales: ${candidate.points}`);
    }
  } catch (e) { console.error(e); }
  finally { await prisma.$disconnect(); }
}

checkPoints();
