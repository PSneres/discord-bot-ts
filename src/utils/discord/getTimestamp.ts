export default function getTimestamp(durationMs: number): string {
    const expiresAtMs = Date.now() + durationMs;
    const expiresAtSeconds = Math.floor(expiresAtMs / 1000);

    return `<t:${expiresAtSeconds}:R>`
}