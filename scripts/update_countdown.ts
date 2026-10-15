import { PrismaClient } from "../prisma/generated/client_v3";

const prisma = new PrismaClient();

async function main() {
    const key = "HERO_COUNTDOWN";
    const value = "2026-04-25T18:00:00";

    console.log(`Actualizando ${key} a ${value} en Iquique...`);

    await prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
    });

    console.log("¡Actualización completada con éxito!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
