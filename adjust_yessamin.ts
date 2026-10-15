import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function adjust() {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { fullName: { contains: 'Yessamin' } }
    });

    if (candidate) {
        const oldPoints = candidate.points;
        const target = 18000;
        const diff = oldPoints - target;

        await prisma.candidate.update({
            where: { id: candidate.id },
            data: { points: target }
        });

        console.log(`Candidata: ${candidate.fullName}`);
        console.log(`Puntos anteriores: ${oldPoints}`);
        console.log(`Nuevos puntos: ${target}`);
        console.log(`Puntos descontados: ${diff}`);
    }

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

adjust();
