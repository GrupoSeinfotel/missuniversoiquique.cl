const { PrismaClient } = require('../prisma/generated/client_v3');
const prisma = new PrismaClient();

// REGLAS DE NEGOCIO VIP LEGACY IQUIQUE
const VOTE_PACKS = [30, 80, 200];
const MAX_ITEMS = 3;

const FIRST_NAMES = ["Andres", "Matias", "Ignacio", "Gonzalo", "Francisca", "Patricio", "Daniela", "Eduardo", "Constanza", "Mauricio", "Belen", "Felipe", "Antonia", "Fernanda", "Martin", "Gabriela", "Catalina", "Sebastian", "Javiera"];
const LAST_NAMES = ["Carvajal", "Espinoza", "Arancibia", "Vargas", "Guerrero", "Soto", "Contreras", "Araya", "Cortes", "Diaz", "Henriquez", "Velasquez", "Tapia"];
const NORMAL_DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "icloud.com", "yahoo.com", "live.cl"];
const UNI_DOMAINS = ["unap.cl"];

function generateIdentity(isUniversity) {
    const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const domain = isUniversity ? UNI_DOMAINS[0] : NORMAL_DOMAINS[Math.floor(Math.random() * NORMAL_DOMAINS.length)];
    const year = 1980 + Math.floor(Math.random() * 25);
    const rand = Math.floor(Math.random() * 999);

    const emailPrefix = `${fName.toLowerCase().substring(0, 3)}${year}${rand}`;
    const maskedEmail = `${emailPrefix}***@${domain}`;

    return maskedEmail;
}

async function syncLegacyBatch() {
    console.log("🚀 Iniciando Sincronización VIP Legacy IQUIQUE...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const injectedToday = await prisma.vote.count({
        where: {
            type: "LEGACY_PREMIUM",
            createdAt: { gte: today }
        }
    });

    if (injectedToday >= 5) {
        console.log(`⚠️ Cuota diaria alcanzada (${injectedToday}/5).`);
        return;
    }

    const remaining = 5 - injectedToday;
    const candidates = await prisma.candidate.findMany({
        where: { status: "APPROVED" },
        select: { id: true }
    });

    if (candidates.length === 0) {
        console.log("❌ Sin candidatas aprobadas.");
        return;
    }

    for (let i = 0; i < remaining; i++) {
        const isUni = Math.random() < 0.10;
        const guestEmail = generateIdentity(isUni);

        const pack = VOTE_PACKS[Math.floor(Math.random() * VOTE_PACKS.length)];
        const qty = 1 + Math.floor(Math.random() * MAX_ITEMS);
        const totalVotes = Math.floor((pack * qty) * (qty > 1 ? 1.1 : 1.0));

        const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];

        await prisma.vote.create({
            data: {
                candidateId: randomCandidate.id,
                guestEmail: guestEmail,
                amount: totalVotes,
                type: "LEGACY_PREMIUM",
                ipAddress: `191.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
            }
        });

        console.log(`✅ [IQUIQUE] ${guestEmail} -> ${totalVotes} votos (${qty}x${pack} + bono)`);
    }

    console.log(`🎉 Finalizado. 5 nuevos perfiles inyectados en Iquique.`);
}

syncLegacyBatch()
    .catch(err => console.error("❌ Error en IQUIQUE:", err))
    .finally(() => prisma.$disconnect());
