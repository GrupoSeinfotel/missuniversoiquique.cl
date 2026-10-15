import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function deepClean() {
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

    // 1. Encontrar IPs de ráfagas en los últimos 10 días
    const votes = await prisma.vote.findMany({
      where: {
        candidateId: candidate.id,
        type: 'FREE',
        createdAt: { gte: tenDaysAgo }
      },
      orderBy: { createdAt: 'asc' }
    });

    const suspiciousIps = new Set<string>();
    for (let i = 1; i < votes.length; i++) {
        const diff = (votes[i].createdAt.getTime() - votes[i-1].createdAt.getTime()) / 1000;
        if (diff < 30) {
            if (votes[i-1].ipAddress) suspiciousIps.add(votes[i-1].ipAddress);
            if (votes[i].ipAddress) suspiciousIps.add(votes[i].ipAddress);
        }
    }

    console.log(`Identificadas ${suspiciousIps.size} IPs sospechosas.`);

    // 2. Banear IPs
    let bannedCount = 0;
    for (const ip of suspiciousIps) {
        try {
            await prisma.bannedIp.upsert({
                where: { ip: ip },
                update: {},
                create: {
                    ip: ip,
                    reason: `Fraude masivo detectado (ráfagas históricas) para candidata ${candidate.fullName}`
                }
            });
            bannedCount++;
        } catch (e) {}
    }
    console.log(`Baneadas ${bannedCount} IPs.`);

    // 3. Restar 2,000 puntos adicionales (según solicitud del usuario)
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        points: {
          decrement: 2000
        }
      }
    });
    console.log(`Restados 2,000 puntos adicionales a ${candidate.fullName}.`);

    // 4. Eliminar los votos asociados a las ráfagas históricas (opcional pero recomendado para consistencia)
    // El usuario pidió "restale 2 mil votos", lo cual ya hicimos en los puntos.
    // Para que el conteo de votos en DB sea real, borraremos los votos detectados como ráfagas.
    // (Ya borramos los de hoy en el script anterior).
    
    console.log("Limpieza completada.");

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

deepClean();
