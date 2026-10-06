const compact = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
});

export default function formatCompact(value: number): string {
    return compact.format(value);
}