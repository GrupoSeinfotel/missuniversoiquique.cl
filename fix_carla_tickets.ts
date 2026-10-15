import { PrismaClient } from './prisma/generated/client_v3';

const prisma = new PrismaClient();

async function fixCarlaTickets() {
  try {
    const candidateId = 'cmmvdye7m003xgelc9bc5nq7h'; // Carla Vial Muñoz
    
    const tickets = await prisma.ticket.findMany({
      where: {
        candidateId: candidateId,
        transactionId: null,
        isManual: true
      }
    });

    if (tickets.length === 0) {
      console.log("No hay tickets manuales sin transacción para esta candidata.");
      return;
    }

    console.log(`Encontrados ${tickets.length} tickets manuales para vincular.`);

    // Crear la transacción de evento
    // Nota: Usamos un flowOrder ficticio (e.g., MANUAL-FIX-...) para que el filtro NOT { flowOrder: null } la incluya.
    const transaction = await prisma.ticketEventTransaction.create({
      data: {
        commerceOrder: "MANUAL-" + Date.now(),
        flowOrder: "MANUAL-FIX", // Importante para que aparezca en el reporte según el filtro actual
        status: "PAID",
        amount: 0,
        email: tickets[0].email,
        name: tickets[0].name,
        quantity: tickets.length,
        ticketType: tickets[0].type, // Asumimos que todos son del mismo tipo (GENERAL en este caso)
        candidateId: candidateId
      }
    });

    console.log(`Transacción creada: ${transaction.id}`);

    // Vincular los tickets a la transacción
    await prisma.ticket.updateMany({
      where: {
        id: { in: tickets.map(t => t.id) }
      },
      data: {
        transactionId: transaction.id
      }
    });

    console.log("Tickets vinculados con éxito.");

  } catch (error) {
    console.error("Error fijando tickets:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCarlaTickets();
