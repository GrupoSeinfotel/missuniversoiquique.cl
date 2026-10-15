export interface LevelInfo {
    level: number;
    name: string;
    minPoints: number;
    badgeColor: string;
    icon: string;
    features: string[];
    skinClass: string;
    previewText?: string;
    impact?: string;
}


export const LEVELS: LevelInfo[] = [
    {
        level: 1,
        name: "Aspirante",
        minPoints: 0,
        badgeColor: "#666666",
        icon: "⚪",
        features: ["Bio básica"],
        skinClass: "skin-default",
        previewText: "Perfil estándar con información básica de candidatura.",
        impact: "Estado inicial de todas las candidatas."
    },
    {
        level: 2,
        name: "Candidata Seleccionada",
        minPoints: 200,
        badgeColor: "#818181",
        icon: "📝",
        features: ["Bio sin límites"],
        skinClass: "skin-default",
        previewText: "Desbloquea la capacidad de escribir tu historia completa sin restricciones.",
        impact: "Escribe tu historia sin límite corto de caracteres."
    },
    {
        level: 3,
        name: "Candidata Oficial ✅",
        minPoints: 500,
        badgeColor: "#9ca3af",
        icon: "🥈",
        features: ["Badge de Verificación"],
        skinClass: "skin-default",
        previewText: "Obtén el check plateado que confirma tu identidad oficial.",
        impact: "Insignia plateada que confirma tu identidad oficial."
    },
    {
        level: 4,
        name: "Protagonista",
        minPoints: 900,
        badgeColor: "#cd7f32",
        icon: "🥉",
        features: ["Elección de Portada"],
        skinClass: "skin-bronze",
        previewText: "Elige qué foto es la primera impresión de tu enlace público.",
        impact: "Decide qué foto es la primera impresión de tu enlace."
    },
    {
        level: 5,
        name: "Social Media Pro",
        minPoints: 1400,
        badgeColor: "#60a5fa",
        icon: "📱",
        features: ["Redes Clickeables"],
        skinClass: "skin-bronze",
        previewText: "Tus perfiles de Instagram y TikTok se vuelven botones directos.",
        impact: "Tus redes se vuelven botones directos para ganar seguidores."
    },
    {
        level: 6,
        name: "Imagen Icónica",
        minPoints: 2000,
        badgeColor: "#3b82f6",
        icon: "🖼️",
        features: ["Gestión de Galería", "Editar Perfil Completo", "Video Pitch Oficial"],
        skinClass: "skin-influencer",
        previewText: "Control total para subir, borrar o reordenar tus fotos de casting.",
        impact: "Control total para gestionar tus fotos de casting."
    },
    {
        level: 7,
        name: "Referente Regional",
        minPoints: 2600,
        badgeColor: "#8b5cf6",
        icon: "🔝",
        features: ["Prioridad en Listas"],
        skinClass: "skin-influencer",
        previewText: "Aparecerás en los primeros lugares de los buscadores internos.",
        impact: "Aparece en los primeros lugares de los buscadores internos."
    },
    {
        level: 8,
        name: "Ícono de Estilo",
        minPoints: 3300,
        badgeColor: "#a78bfa",
        icon: "✨",
        features: ["Filtros Fotográficos"],
        skinClass: "skin-influencer",
        previewText: "Aplica efectos (Blanco y Negro, Cine) a tus fotos desde el dashboard.",
        impact: "Aplica efectos artísticos a tus fotos desde el dashboard."
    },
    {
        level: 9,
        name: "Embajadora Digital",
        minPoints: 4000,
        badgeColor: "#fbbf24",
        icon: "🥇",
        features: ["URL Personalizada (Slug)"],
        skinClass: "skin-gold",
        previewText: "El enlace profesional con tu propio nombre (missuniverso.../tu-nombre).",
        impact: "El enlace con tu nombre propio (ej: .../tu-nombre)."
    },
    {
        level: 10,
        name: "Prestigio Universal",
        minPoints: 5000,
        badgeColor: "#f59e0b",
        icon: "📊",
        features: ["Análisis de Votos"],
        skinClass: "skin-gold",
        previewText: "Gráficos detallados de las ciudades desde donde más te votan.",
        impact: "Gráficos que muestran desde qué ciudades te votan más."
    },
    {
        level: 11,
        name: "Distinción Diamante 💎",
        minPoints: 6200,
        badgeColor: "#e5e7eb",
        icon: "💎",
        features: ["Skin Diamante"],
        skinClass: "skin-diamond",
        previewText: "Diseño de perfil con tonos blancos brillantes y bordes luminosos.",
        impact: "Diseño con tonos blancos brillantes y bordes luminosos."
    },
    {
        level: 12,
        name: "Corte Real",
        minPoints: 7500,
        badgeColor: "#f4245f",
        icon: "💖",
        features: ["Botón Apóyame Persistente"],
        skinClass: "skin-diamond",
        previewText: "Un botón flotante persistente en tu perfil para voto rápido.",
        impact: "Botón flotante persistente que facilita el voto rápido."
    },
    {
        level: 13,
        name: "Elite Rose Gold",
        minPoints: 8500,
        badgeColor: "#fda4af",
        icon: "🌹",
        features: ["Skin Rose Gold"],
        skinClass: "skin-rosegold",
        previewText: "Estética de alta gama en tonos rosados metálicos y fuentes premium.",
        impact: "Estética metálica de alta gama y fuentes premium."
    },
    {
        level: 14,
        name: "Soberana de Plataforma",
        minPoints: 9500,
        badgeColor: "#000000",
        icon: "👑",
        features: ["Acceso VIP Priority"],
        skinClass: "skin-premium",
        previewText: "Desbloquea soporte prioritario y acceso anticipado.",
        impact: "Soporte prioritario y visibilidad destacada."
    },
    {
        level: 15,
        name: "REINA SUPREMA 👑",
        minPoints: 10000,
        badgeColor: "#000000",
        icon: "🌟",
        features: ["Skin Obsidian & Gold", "Corona Animada"],
        skinClass: "skin-obsidian-gold",
        previewText: "Perfil Negro-Oro exclusivo para la líder. Con corona animada.",
        impact: "Perfil Negro-Oro exclusivo con corona animada."
    },
    {
        level: 16,
        name: "DIOSA DE PLATAFORMA 💎👑",
        minPoints: 20000,
        badgeColor: "#e5e4e2",
        icon: "✨",
        features: ["Efectos Platino de Alto Impacto"],
        skinClass: "skin-obsidian-gold",
        previewText: "El nivel de las inalcanzables. Diseño platino supremo.",
        impact: "Estética reservada para las candidatas más influyentes."
    },
    {
        level: 17,
        name: "LEYENDA UNIVERSAL 🌟🔥",
        minPoints: 30000,
        badgeColor: "#ff0000",
        icon: "🔥",
        features: ["Animación de Fuego", "Destacado Global"],
        skinClass: "skin-obsidian-gold",
        previewText: "El nivel definitivo y legendario. Fuego y poder absoluto.",
        impact: "Máxima jerarquía del sistema."
    }
];

export function getLevelData(points: number): LevelInfo {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (points >= LEVELS[i].minPoints) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

export function getNextLevel(points: number): LevelInfo | null {
    const current = getLevelData(points);
    const index = LEVELS.findIndex(l => l.level === current.level);
    if (index < LEVELS.length - 1) {
        return LEVELS[index + 1];
    }
    return null;
}

export function isFeatureUnlocked(points: number, featureName: string): boolean {
    const currentLevel = getLevelData(points);
    // Unlocked if any level up to current includes this feature
    return LEVELS.filter(l => l.level <= currentLevel.level)
        .some(l => l.features.includes(featureName));
}
