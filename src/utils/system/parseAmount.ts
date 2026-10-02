const MULTIPLIERS: Record<string, number> = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 };

export default function parseAmount(input: string | undefined): number {
    if (!input) return NaN;

    const match = /^(\d+)([kmbt])?$/i.exec(input.trim());
    if (!match) return NaN;

    const [_, digits, suffix] = match;
    if (!digits || !suffix) return NaN;

    const multiplier = suffix ? MULTIPLIERS[suffix.toLowerCase()] : 1;
    if (!multiplier) return NaN;
    
    const value = Number(digits) * multiplier;

    return Math.round(value);
}