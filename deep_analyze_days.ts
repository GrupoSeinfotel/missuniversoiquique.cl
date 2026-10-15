import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function deepAnalyze() {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { fullName: { contains: 'Yessamin' } }
    });

    if (!candidate) return;

    // Analizar el 22 y 23 de abril
    const targetDates = ['2026-04-22', '2026-04-23'];
    
    for (const dateStr of targetDates) {
        const start = new Date(dateStr);
        start.setHours(0,0,0,0);
        const end = new Date(dateStr);
        end.setHours(23,59,59,999);

        const votes = await prisma.vote.findMany({
            where: {
                candidateId: candidate.id,
                type: 'FREE',
                createdAt: { gte: start, lte: end }
            },
            orderBy: { createdAt: 'asc' }
        });

        console.log(`\n=== ANÁLISIS DETALLADO: ${dateStr} ===`);
        console.log(`Total Votos: ${votes.length}`);

        // Agrupar por hora
        const hourly: {[key: number]: number} = {};
        const ips = new Set<string>();
        votes.forEach(v => {
            const hour = v.createdAt.getHours();
            hourly[hour] = (hourly[hour] || 0) + 1;
            if (v.ipAddress) ips.add(v.ipAddress);
        });

        console.log("Votos por hora:");
        Object.entries(hourly).forEach(([h, count]) => {
            console.log(`  ${h.padStart(2, '0')}:00 - ${count} votos`);
        });

        console.log(`IPs únicas: ${ips.size}`);
        console.log(`Promedio votos por IP: ${(votes.length / ips.size).toFixed(2)}`);

        // Detectar si hay ráfagas de 30 segundos
        let suspectCount30s = 0;
        for (let i = 1; i < votes.length; i++) {
            const diff = (votes[i].createdAt.getTime() - votes[i-1].createdAt.getTime()) / 1000;
            if (diff < 30) suspectCount30s++;
        }
        console.log(`Votos con frecuencia < 30s: ${suspectCount30s} (${((suspectCount30s/votes.length)*100).toFixed(1)}%)`);
    }

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

deepAnalyze();
