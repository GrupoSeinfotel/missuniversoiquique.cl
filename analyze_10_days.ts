import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function analyzeHistoricalVotes() {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { fullName: { contains: 'Yessamin' } }
    });

    if (!candidate) {
      console.log("Candidata no encontrada.");
      return;
    }

    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    tenDaysAgo.setHours(0, 0, 0, 0);

    console.log(`Analizando votos de ${candidate.fullName} desde el ${tenDaysAgo.toISOString()}`);

    const historicalVotes = await prisma.vote.findMany({
      where: {
        candidateId: candidate.id,
        type: 'FREE',
        createdAt: { gte: tenDaysAgo }
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`Total de votos FREE en los últimos 10 días: ${historicalVotes.length}`);

    if (historicalVotes.length === 0) return;

    // Agrupar por día para ver la evolución
    const dailyStats: {[key: string]: {total: number, suspicious: number}} = {};
    const suspiciousVoteIds: string[] = [];

    for (let i = 0; i < historicalVotes.length; i++) {
        const curr = historicalVotes[i];
        const dayKey = curr.createdAt.toISOString().split('T')[0];
        
        if (!dailyStats[dayKey]) dailyStats[dayKey] = {total: 0, suspicious: 0};
        dailyStats[dayKey].total++;

        // Verificar frecuencia con el anterior si existe
        if (i > 0) {
            const prev = historicalVotes[i-1];
            const diff = (curr.createdAt.getTime() - prev.createdAt.getTime()) / 1000;
            if (diff < 10) {
                dailyStats[dayKey].suspicious++;
                suspiciousVoteIds.push(curr.id);
            }
        }
    }

    console.log("\nEstadísticas diarias:");
    console.table(Object.entries(dailyStats).map(([day, stats]) => ({
        Día: day,
        Total: stats.total,
        Sospechosos: stats.suspicious,
        'Porcentaje %': ((stats.suspicious / stats.total) * 100).toFixed(1) + '%'
    })));

    console.log(`\nTotal sospechosos acumulados en 10 días: ${suspiciousVoteIds.length}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeHistoricalVotes();
