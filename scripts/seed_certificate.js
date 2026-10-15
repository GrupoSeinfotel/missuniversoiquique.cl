const { PrismaClient } = require("../prisma/generated/client_v4");
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding initial certificate...");
    try {
        const cert1 = await prisma.certificate.upsert({
            where: { code: "MIQ-2026-017" },
            update: {
                fullName: "Ayalent Nazareth Álvarez Bautista",
                idNumber: "22.195.742-3",
                address: "Avenida Las Parcelas 4178",
                phone: "945798590",
                title: "Miss Universo Iquique 2026",
                issuedAt: new Date("2026-04-27T12:00:00"),
                imageUrl: "/assets/certifi5282.png",
            },
            create: {
                code: "MIQ-2026-017",
                fullName: "Ayalent Nazareth Álvarez Bautista",
                idNumber: "22.195.742-3",
                address: "Avenida Las Parcelas 4178",
                phone: "945798590",
                title: "Miss Universo Iquique 2026",
                issuedAt: new Date("2026-04-27T12:00:00"),
                imageUrl: "/assets/certifi5282.png",
            },
        });
        console.log("Certificate 1 seeded successfully:", cert1.code);

        const cert2 = await prisma.certificate.upsert({
            where: { code: "MIQ-2026-REP-005" },
            update: {
                fullName: "Poleth Valentina León Tapia",
                idNumber: "21.689.153-8",
                address: "Trece Oriente 1259, Iquique",
                phone: "+56954987560",
                title: "Certificado de Participación en Repechaje Universal",
                issuedAt: new Date("2026-04-28T12:00:00"),
                imageUrl: "/assets/certifi_po45.png",
            },
            create: {
                code: "MIQ-2026-REP-005",
                fullName: "Poleth Valentina León Tapia",
                idNumber: "21.689.153-8",
                address: "Trece Oriente 1259, Iquique",
                phone: "+56954987560",
                title: "Certificado de Participación en Repechaje Universal",
                issuedAt: new Date("2026-04-28T12:00:00"),
                imageUrl: "/assets/certifi_po45.png",
            },
        });
        console.log("Certificate 2 seeded successfully:", cert2.code);
    } catch (error) {
        console.error("Error seeding certificate:", error);
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
