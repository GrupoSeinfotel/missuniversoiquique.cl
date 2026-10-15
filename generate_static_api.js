const { PrismaClient } = require('./prisma/generated/client_v4');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log("Generating static API data...");
    
    // Create directories
    const apiDir = path.join(__dirname, 'public', 'api');
    const adminDir = path.join(apiDir, 'admin');
    const ticketsDir = path.join(apiDir, 'tickets');
    
    fs.mkdirSync(adminDir, { recursive: true });
    fs.mkdirSync(ticketsDir, { recursive: true });

    // 1. Settings
    const settings = await prisma.systemSetting.findMany();
    fs.writeFileSync(path.join(adminDir, 'settings.json'), JSON.stringify(settings));
    console.log("Written settings.json");

    // 2. Slider
    const homeSlider = await prisma.heroSlide.findUnique({ where: { id: 'home-main' } });
    if (homeSlider) {
        fs.writeFileSync(path.join(adminDir, 'slider.json'), homeSlider.configJson);
        console.log("Written slider.json");
    } else {
        fs.writeFileSync(path.join(adminDir, 'slider.json'), JSON.stringify({ error: "No slider found" }));
        console.log("Written empty slider");
    }

    // 3. Tickets Pricing
    const pricing = await prisma.systemSetting.findMany({
        where: { key: { in: ['VIP_TICKET_PRICE', 'VIP_PRESALE_PRICE', 'GENERAL_TICKET_PRICE', 'GENERAL_PRESALE_PRICE', 'PRESALE_END_DATE', 'PRESALE_ACTIVE'] } }
    });
    
    const getVal = (k, def) => {
        const s = pricing.find(s => s.key === k);
        return s ? Number(s.value) : def;
    };
    
    const isPresale = pricing.find(s => s.key === 'PRESALE_ACTIVE')?.value === 'true';
    const presaleEndDate = pricing.find(s => s.key === 'PRESALE_END_DATE')?.value || new Date().toISOString();
    
    const pricingData = {
        isPresale,
        presaleEndDate,
        VIP: {
            presalePrice: getVal('VIP_PRESALE_PRICE', 20000),
            normalPrice: getVal('VIP_TICKET_PRICE', 35000),
            currentPrice: isPresale ? getVal('VIP_PRESALE_PRICE', 20000) : getVal('VIP_TICKET_PRICE', 35000)
        },
        GENERAL: {
            presalePrice: getVal('GENERAL_PRESALE_PRICE', 15000),
            normalPrice: getVal('GENERAL_TICKET_PRICE', 25000),
            currentPrice: isPresale ? getVal('GENERAL_PRESALE_PRICE', 15000) : getVal('GENERAL_TICKET_PRICE', 25000)
        }
    };
    fs.writeFileSync(path.join(ticketsDir, 'pricing.json'), JSON.stringify(pricingData));
    console.log("Written tickets/pricing.json");

    // 4. Candidates
    const candidates = await prisma.candidate.findMany({
        where: { status: 'APPROVED' },
        select: { id: true, fullName: true, user: { select: { slug: true } } }
    });
    fs.writeFileSync(path.join(apiDir, 'candidates.json'), JSON.stringify(candidates));
    console.log("Written candidates.json");

}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
