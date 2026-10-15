// DB connection - force reload 4
import { PrismaClient } from "../../prisma/generated/client_v4";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prismaGlobalV4: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobalV4 ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobalV4 = prisma;
