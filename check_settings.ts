import { PrismaClient } from "./prisma/generated/client2";
const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.systemSetting.findMany();
    console.log(JSON.stringify(settings, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
