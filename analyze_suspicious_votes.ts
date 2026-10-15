import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function analyzeVotes() {
  try {
    // 1. Encontrar a la candidata
    const candidate = await prisma.candidate.findFirst({
      where: {
        fullName: {
          contains: 'Yessamin'
        }
      }
    });

    if (!candidate) {
      console.log("No se encontró a la candidata Yessamin.");
      return;
    }

    console.log(`Analizando a: ${candidate.fullName} (ID: ${candidate.id})`);

    // 2. Obtener votos FREE de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const votesToday = await prisma.vote.findMany({
      where: {
        candidateId: candidate.id,
        type: 'FREE',
        createdAt: {
          gte: today
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`Total de votos FREE hoy: ${votesToday.length}`);

    // 3. Analizar frecuencia (votos con menos de 10 segundos de diferencia)
    let suspiciousCount = 0;
    const suspiciousGroups = [];
    
    for (let i = 1; i < votesToday.length; i++) {
      const prev = votesToday[i-1];
      const curr = votesToday[i];
      const diff = (curr.createdAt.getTime() - prev.createdAt.getTime()) / 1000;

      if (diff < 10) { // Menos de 10 segundos
        suspiciousCount++;
        suspiciousGroups.push({
          time1: prev.createdAt.toISOString(),
          time2: curr.createdAt.toISOString(),
          diffSeconds: diff,
          ip1: prev.ipAddress,
          ip2: curr.ipAddress
        });
      }
    }

    console.log(`Votos sospechosos (frecuencia < 10s): ${suspiciousCount}`);
    
    // 4. Agrupar por IP para ver si hay IPs dominantes hoy
    const ipCounts: {[key: string]: number} = {};
    votesToday.forEach(v => {
      const ip = v.ipAddress || 'unknown';
      ipCounts[ip] = (ipCounts[ip] || 0) + 1;
    });

    const sortedIps = Object.entries(ipCounts).sort((a, b) => b[1] - a[1]);
    console.log("\nTop IPs de hoy:");
    sortedIps.slice(0, 10).forEach(([ip, count]) => {
      console.log(`${ip}: ${count} votos`);
    });

    if (suspiciousGroups.length > 0) {
      console.log("\nEjemplos de ráfagas sospechosas:");
      suspiciousGroups.slice(0, 5).forEach(g => {
        console.log(`- ${g.time1} y ${g.time2} (${g.diffSeconds}s) | IPs: ${g.ip1} -> ${g.ip2}`);
      });
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeVotes();
