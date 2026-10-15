import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function analyzeRecentVotes() {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { fullName: { contains: 'Jacqueline' } }
    });

    if (!candidate) {
      console.log("Candidate not found");
      return;
    }

    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const recentVotes = await prisma.vote.findMany({
      where: {
        candidateId: candidate.id,
        createdAt: { gte: yesterday }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Análisis de votos para ${candidate.fullName} (Últimas 24h):`);
    console.log(`Total votos: ${recentVotes.length}`);

    // Analizar frecuencia
    const groups: { [key: string]: number } = {};
    recentVotes.forEach(v => {
      const minute = v.createdAt.toISOString().substring(0, 16); // yyyy-mm-ddThh:mm
      groups[minute] = (groups[minute] || 0) + 1;
    });

    console.log("\nVotos por minuto (Picos sospechosos > 5):");
    Object.entries(groups)
      .filter(([_, count]) => count > 5)
      .forEach(([time, count]) => {
        console.log(`${time}: ${count} votos`);
      });

    // Analizar IPs
    const ips: { [key: string]: number } = {};
    recentVotes.forEach(v => {
      ips[v.ipAddress] = (ips[v.ipAddress] || 0) + 1;
    });

    // Analizar Fingerprints
    const fingerprints: { [key: string]: number } = {};
    recentVotes.forEach(v => {
      if (v.deviceFingerprint) {
        fingerprints[v.deviceFingerprint] = (fingerprints[v.deviceFingerprint] || 0) + 1;
      }
    });

    console.log("\nTop Fingerprints:");
    Object.entries(fingerprints)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([fp, count]) => {
        console.log(`${fp}: ${count} votos`);
      });

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeRecentVotes();
