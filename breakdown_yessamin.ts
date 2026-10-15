import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function breakdown() {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { fullName: { contains: 'Yessamin' } },
      include: { photos: true, user: true }
    });

    if (!candidate) return;

    const bannedIps = (await prisma.bannedIp.findMany({ select: { ip: true } })).map(b => b.ip);

    const voteStats = await prisma.vote.groupBy({
        by: ['type'],
        where: {
            candidateId: candidate.id,
            ipAddress: { notIn: bannedIps }
        },
        _sum: { amount: true }
    });

    const freeVotes = voteStats.find(s => s.type === 'FREE')?._sum.amount || 0;
    const paidVotes = voteStats.find(s => s.type === 'PAID')?._sum.amount || 0;

    const ticketStats = await prisma.ticket.groupBy({
        by: ['type'],
        where: { 
            status: "PAID",
            candidateId: candidate.id
        },
        _count: { id: true }
    });

    const vipTickets = ticketStats.find(t => t.type === 'VIP')?._count.id || 0;
    const generalTickets = ticketStats.find(t => t.type === 'GENERAL')?._count.id || 0;
    const ticketPoints = (vipTickets * 360) + (generalTickets * 140);

    console.log(`Breakdown for ${candidate.fullName}:`);
    console.log(`Free Votes: ${freeVotes}`);
    console.log(`Paid Votes: ${paidVotes}`);
    console.log(`Imported Votes: ${candidate.importedVotes}`);
    console.log(`Task Points: ${candidate.taskPoints}`);
    console.log(`Ticket Points: ${ticketPoints}`);
    console.log(`Total Calculated: ${freeVotes + paidVotes + candidate.importedVotes + candidate.taskPoints + ticketPoints}`);

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

breakdown();
