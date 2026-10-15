import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function checkAllTypes() {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { fullName: { contains: 'Yessamin' } }
    });
    if (!candidate) return;

    const dates = ['2026-04-22', '2026-04-23'];
    for (const d of dates) {
        const start = new Date(d);
        const end = new Date(d);
        end.setHours(23,59,59,999);

        const types = await prisma.vote.groupBy({
            by: ['type'],
            where: {
                candidateId: candidate.id,
                createdAt: { gte: start, lte: end }
            },
            _count: true
        });

        console.log(`\n${d}:`);
        console.log(types);
    }
  } catch (e) { console.error(e); }
  finally { await prisma.$disconnect(); }
}

checkAllTypes();
