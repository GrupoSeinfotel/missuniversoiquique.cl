import prisma from './db'

export interface HappyHourConfig {
    active: boolean
    freeMultiplier: number
    premiumBonusPercent: number
    startTime: string | null
    endTime: string | null
}

export async function getHappyHourConfig(): Promise<HappyHourConfig | null> {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: 'HAPPY_HOUR_CONFIG' }
        })
        if (!setting) return null
        return JSON.parse(setting.value)
    } catch (error) {
        return null
    }
}

export async function getHappyHourMultiplier(): Promise<number> {
    const config = await getHappyHourConfig()
    if (!config || !config.active) return 1

    const now = new Date()
    if (config.startTime && config.endTime) {
        const start = new Date(config.startTime)
        const end = new Date(config.endTime)
        if (now < start || now > end) return 1
    }

    return config.freeMultiplier || 1
}

export async function getHappyHourPremiumBonus(): Promise<number> {
    const config = await getHappyHourConfig()
    if (!config || !config.active) return 0

    const now = new Date()
    if (config.startTime && config.endTime) {
        const start = new Date(config.startTime)
        const end = new Date(config.endTime)
        if (now < start || now > end) return 0
    }

    return config.premiumBonusPercent || 0
}
