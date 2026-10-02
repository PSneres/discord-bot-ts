const compact = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
});

export default function formatCompact(value: number): string {
    return compact.format(value);
}