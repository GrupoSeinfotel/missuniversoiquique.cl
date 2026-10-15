import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const total = await prisma.vote.count()
        const free = await prisma.vote.count({ where: { type: 'FREE' } })
        const paid = await prisma.vote.count({ where: { type: 'PAID' } })
        console.log(`[CHECK_VOTES] Total: ${total}, Free: ${free}, Paid: ${paid}`)

        if (total > 0) {
            const recent = await prisma.vote.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
            console.log('Recent 5:', JSON.stringify(recent, null, 2))
        } else {
            console.log('No votes found.')
        }
    } catch (e) {
        console.error(e)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
