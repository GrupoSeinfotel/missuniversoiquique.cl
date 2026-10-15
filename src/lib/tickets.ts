import prisma from "./db";

export interface TicketPrices {
    isPresale: boolean;
    presaleEndDate: string;
    VIP: {
        presalePrice: number;
        normalPrice: number;
        currentPrice: number;
    };
    GENERAL: {
        presalePrice: number;
        normalPrice: number;
        currentPrice: number;
    };
}

/**
 * Obtiene los precios de las entradas desde la base de datos (SystemSetting),
 * manejando la lógica de preventas de forma centralizada.
 */
export async function getTicketPrices(): Promise<TicketPrices> {
    try {
        const settings = await prisma.systemSetting.findMany({
            where: {
                key: {
                    in: [
                        "TICKET_VIP_PRESALE_PRICE",
                        "TICKET_VIP_NORMAL_PRICE",
                        "TICKET_GENERAL_PRESALE_PRICE",
                        "TICKET_GENERAL_NORMAL_PRICE",
                        "TICKET_PRESALE_END_DATE"
                    ]
                }
            }
        });

        const find = (key: string, fallback: string) =>
            settings.find(s => s.key === key)?.value ?? fallback;

        const presaleEndDateStr = find("TICKET_PRESALE_END_DATE", "2026-06-01T00:00:00");
        const presaleEndDate    = new Date(presaleEndDateStr);
        const isPresale         = new Date() < presaleEndDate;

        // Precios
        const vipPresale     = Number(find("TICKET_VIP_PRESALE_PRICE",     "15000"));
        const vipNormal      = Number(find("TICKET_VIP_NORMAL_PRICE",      "20000"));
        const generalPresale = Number(find("TICKET_GENERAL_PRESALE_PRICE", "10000"));
        const generalNormal  = Number(find("TICKET_GENERAL_NORMAL_PRICE",  "15000"));

        return {
            isPresale,
            presaleEndDate: presaleEndDateStr,
            VIP: {
                presalePrice: vipPresale,
                normalPrice:  vipNormal,
                currentPrice: isPresale ? vipPresale : vipNormal
            },
            GENERAL: {
                presalePrice: generalPresale,
                normalPrice:  generalNormal,
                currentPrice: isPresale ? generalPresale : generalNormal
            }
        };
    } catch (error) {
        console.error("Error en getTicketPrices:", error);
        return {
            isPresale: true,
            presaleEndDate: "2026-06-01T00:00:00",
            VIP: { presalePrice: 15000, normalPrice: 20000, currentPrice: 15000 },
            GENERAL: { presalePrice: 10000, normalPrice: 15000, currentPrice: 10000 }
        };
    }
}
