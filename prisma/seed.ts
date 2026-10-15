import { PrismaClient } from "@prisma/client";
import { Scrypt } from "oslo/password";

const prisma = new PrismaClient();

async function main() {
    const scrypt = new Scrypt();
    const hashedPassword = await scrypt.hash("admin123");

    const admins = [
        { id: "nelson-admin", email: "nelson@missuniversoiquique.cl", name: "Nelson" },
        { id: "michael-admin", email: "michael@missuniversoiquique.cl", name: "Michael" },
        { id: "juan-admin", email: "juan@missuniversoiquique.cl", name: "Juan" }
    ];

    for (const admin of admins) {
        await prisma.user.upsert({
            where: { email: admin.email },
            update: { role: "SUPERADMIN" },
            create: {
                id: admin.id,
                email: admin.email,
                hashedPassword: hashedPassword,
                role: "SUPERADMIN",
                username: admin.name.toLowerCase(),
                slug: admin.name.toLowerCase()
            }
        });
        console.log(`Admin ${admin.name} verified.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
