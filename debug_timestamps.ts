import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function debug() {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { fullName: { contains: 'Yessamin' } }
    });
    if (!candidate) return;

    const votes = await prisma.vote.findMany({
      where: {
        candidateId: candidate.id,
        createdAt: {
            gte: new Date('2026-04-21T00:00:00Z'),
            lte: new Date('2026-04-24T23:59:59Z')
        }
      },
      select: { createdAt: true, type: true },
      orderBy: { createdAt: 'asc' }
    });

    const byDay: {[key: string]: number} = {};
    votes.forEach(v => {
        const d = v.createdAt.toISOString().split('T')[0];
        byDay[d] = (byDay[d] || 0) + 1;
    });

    console.log("Votos por día (UTC ISO):");
    console.log(byDay);
  } catch (e) { console.error(e); }
  finally { await prisma.$disconnect(); }
}

debug();
