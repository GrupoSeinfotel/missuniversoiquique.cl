import prisma from "../src/lib/db";

async function main() {
    console.log("Seeding initial certificate...");
    
    const cert = await prisma.certificate.upsert({
        where: { code: "MIQ-2026-017" },
        update: {
            fullName: "Ayalent Nazareth Álvarez Bautista",
            idNumber: "22.195.742-3",
            address: "Avenida Las Parcelas 4178",
            phone: "945798590",
            title: "Miss Universo Iquique 2026",
            issuedAt: new Date("2026-05-03"),
            imageUrl: "/assets/certifi5282.png",
        },
        create: {
            code: "MIQ-2026-017",
            fullName: "Ayalent Nazareth Álvarez Bautista",
            idNumber: "22.195.742-3",
            address: "Avenida Las Parcelas 4178",
            phone: "945798590",
            title: "Miss Universo Iquique 2026",
            issuedAt: new Date("2026-05-03"),
            imageUrl: "/assets/certifi5282.png",
        },
    });

    console.log("Certificate seeded successfully:", cert.code);
}

main()
    .catch((e) => {
        console.error("Error seeding certificate:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
