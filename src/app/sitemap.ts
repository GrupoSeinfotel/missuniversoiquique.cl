import { MetadataRoute } from 'next'
import prisma from '@/lib/db'

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://missuniversoiquique.cl'

    // 1. Rutas estáticas principales
    const staticPaths = [
        '',
        '/ranking-candidatas',
        '/reyes-de-la-corona',
        '/sponsors',
        '/casting',
        '/beneficios',
        '/sobre-nosotros',
        '/descubre-iquique',
    ]

    const staticRoutes = staticPaths.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // 2. Rutas dinámicas de candidatas (solo las aprobadas)
    const candidates = await prisma.candidate.findMany({
        where: { status: 'APPROVED' },
        select: { user: { select: { slug: true } }, updatedAt: true }
    })

    const candidateRoutes = candidates
        .filter(c => c.user?.slug)
        .map((c) => ({
            url: `${baseUrl}/candidata/${c.user.slug}`,
            lastModified: c.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))

    return [...staticRoutes, ...candidateRoutes]
}
