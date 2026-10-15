
/**
 * Calculates the current engagement value based on a base value, 
 * a daily growth rate (percentage), and a start date.
 * 
 * Formula: CurrentValue = BaseValue * (1 + Rate)^DaysPassed
 * 
 * To make it feel "intelligent" and "random", we add a deterministic 
 * pseudo-random jitter based on the object's creation/start time.
 * 
 * @param base Initial value
 * @param rate Daily growth rate (e.g. 0.6 for 60%)
 * @param startDate Date when growth started
 * @returns The calculated integer value
 */
export function calculateGrowthEngagement(base: number, rate: number, startDate: Date): number {
    if (!base || base <= 0) return 0;

    // If rate is 0, just return the base
    if (rate === undefined || rate === null || rate <= 0) return Math.floor(base);

    const now = new Date();
    const start = new Date(startDate);

    // Difference in milliseconds
    const diff = now.getTime() - start.getTime();
    if (diff <= 0) return Math.floor(base);

    // Days passed as a fractional number
    const fractionalDays = diff / (1000 * 60 * 60 * 24);

    // Compounding growth formula: C = B * (1 + r)^t
    // Using fractional days for smooth update
    const currentVal = base * Math.pow(1 + rate, fractionalDays);
 
    return Math.floor(currentVal);
}
