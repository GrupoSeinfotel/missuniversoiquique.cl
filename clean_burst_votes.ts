import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function cleanBursts() {
  try {
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const candidates = await prisma.candidate.findMany({ select: { id: true, fullName: true } });

    for (const candidate of candidates) {
      const votes = await prisma.vote.findMany({
        where: {
          candidateId: candidate.id,
          createdAt: { gte: yesterday },
          type: 'FREE'
        },
        orderBy: { createdAt: 'asc' }
      });

      if (votes.length === 0) continue;

      // Group by minute
      const minutes: { [key: string]: any[] } = {};
      votes.forEach(v => {
        const min = v.createdAt.toISOString().substring(0, 16);
        if (!minutes[min]) minutes[min] = [];
        minutes[min].push(v);
      });

      let totalDeleted = 0;
      let totalPointsDeduced = 0;

      for (const [time, vList] of Object.entries(minutes)) {
        // If more than 10 votes per minute and high diversity (likely bot)
        if (vList.length >= 10) {
            const idsToDelete = vList.map(v => v.id);
            const points = vList.reduce((acc, v) => acc + (v.amount || 0), 0);

            await prisma.vote.deleteMany({
                where: { id: { in: idsToDelete } }
            });

            totalDeleted += vList.length;
            totalPointsDeduced += points;
            console.log(`[${candidate.fullName}] Deleted burst of ${vList.length} votes at ${time}`);
        }
      }

      if (totalDeleted > 0) {
        await prisma.candidate.update({
            where: { id: candidate.id },
            data: { points: { decrement: totalPointsDeduced } }
        });
        console.log(`TOTAL for ${candidate.fullName}: Deleted ${totalDeleted} votes, Deduced ${totalPointsDeduced} points.`);
      }
    }

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanBursts();
