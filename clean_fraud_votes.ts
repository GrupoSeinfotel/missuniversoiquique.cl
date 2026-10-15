import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function cleanVotes() {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { fullName: { contains: 'Yessamin' } }
    });

    if (!candidate) {
      console.log("Candidata no encontrada.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Identificar votos FREE de hoy
    const votesToday = await prisma.vote.findMany({
      where: {
        candidateId: candidate.id,
        type: 'FREE',
        createdAt: { gte: today }
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`Votos totales FREE hoy: ${votesToday.length}`);

    // 2. Filtrar los sospechosos (frecuencia < 10s)
    const suspiciousVoteIds: string[] = [];
    const suspiciousIps = new Set<string>();

    for (let i = 1; i < votesToday.length; i++) {
      const prev = votesToday[i-1];
      const curr = votesToday[i];
      const diff = (curr.createdAt.getTime() - prev.createdAt.getTime()) / 1000;

      if (diff < 10) {
        if (!suspiciousVoteIds.includes(prev.id)) {
            suspiciousVoteIds.push(prev.id);
            if (prev.ipAddress) suspiciousIps.add(prev.ipAddress);
        }
        if (!suspiciousVoteIds.includes(curr.id)) {
            suspiciousVoteIds.push(curr.id);
            if (curr.ipAddress) suspiciousIps.add(curr.ipAddress);
        }
      }
    }

    console.log(`Identificados ${suspiciousVoteIds.length} votos sospechosos.`);
    console.log(`Identificadas ${suspiciousIps.size} IPs para baneo.`);

    if (suspiciousVoteIds.length === 0) {
        console.log("No se encontraron votos para eliminar.");
        return;
    }

    // 3. Eliminar los votos
    const deleteResult = await prisma.vote.deleteMany({
      where: {
        id: { in: suspiciousVoteIds }
      }
    });

    console.log(`Eliminados ${deleteResult.count} registros de votos.`);

    // 4. Restar puntos a la candidata (asumiendo 1 punto por voto FREE)
    // Nota: El usuario mencionó 922 votos.
    const pointsToSubtract = deleteResult.count;
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        points: {
          decrement: pointsToSubtract
        }
      }
    });

    console.log(`Restados ${pointsToSubtract} puntos a la candidata.`);

    // 5. Banear las IPs
    let bannedCount = 0;
    for (const ip of suspiciousIps) {
        try {
            await prisma.bannedIp.upsert({
                where: { ip: ip },
                update: {},
                create: {
                    ip: ip,
                    reason: `Fraude detectado: ráfaga de votos para candidata ${candidate.fullName} el 24-04-2026`
                }
            });
            bannedCount++;
        } catch (e) {
            // Probablemente ya baneada
        }
    }

    console.log(`Baneadas ${bannedCount} IPs nuevas.`);

    // 6. Generar Informe para el usuario
    console.log("\n--- INFORME PARA EL GRUPO ---");
    console.log(`Candidata: ${candidate.fullName}`);
    console.log(`Fecha: 24 de Abril, 2026`);
    console.log(`Votos eliminados: ${deleteResult.count}`);
    console.log(`Motivo: Detección de actividad inusual (bots/scripts). Ráfagas de votos con menos de 10 segundos de diferencia.`);
    console.log(`Acción tomada: Eliminación de puntos y baneo permanente de las IPs involucradas.`);
    console.log("------------------------------");

  } catch (error) {
    console.error("Error durante la limpieza:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanVotes();
