import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function compare() {
  try {
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const stats = await prisma.vote.groupBy({
      by: ['candidateId'],
      where: {
        createdAt: { gte: yesterday },
        type: 'FREE'
      },
      _count: { id: true }
    });

    for (const s of stats) {
        const c = await prisma.candidate.findUnique({
            where: { id: s.candidateId },
            select: { fullName: true }
        });
        console.log(`${c?.fullName}: ${s._count.id} votos`);
    }

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

compare();
