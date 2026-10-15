import { MetadataRoute } from 'next'

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Miss Universe Iquique',
        short_name: 'MU Iquique',
        description: 'Plataforma oficial de Miss Universe Iquique',
        start_url: '/',
        display: 'standalone',
        background_color: '#111111',
        theme_color: '#f4245f',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
