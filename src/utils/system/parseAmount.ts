const MULTIPLIERS: Record<string, number> = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 };

export default function parseAmount(input: string | undefined): number {
    if (!input) return NaN;

    const match = /^(\d+(\.\d+)?)([kmbt])?$/i.exec(input.trim().replace(",","."));
    if (!match) return NaN;

    const [, digits, _, suffix] = match;
    if (!digits || !suffix) return NaN;

    const multiplier = suffix ? MULTIPLIERS[suffix.toLowerCase()] : 1;
    if (!multiplier) return NaN;
    
    const value = Number(digits) * multiplier;

    return value;
}