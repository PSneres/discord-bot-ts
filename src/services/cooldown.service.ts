import { memberRepository } from "#repositories"
import Cooldown from "../types/Cooldown.js";

export async function remainingTime(guildId: string, userId: string, key: string): Promise<number> {
    const cooldown: Cooldown = await memberRepository.getCooldown(guildId, userId, key);
    const remaining =  cooldown.expiresAt - Date.now();

    return remaining;
}

export async function clearCooldown(guildId: string, userId: string, key: string): Promise<void> {
    const emptyCooldown: Cooldown = {
        name: key,
        expiresAt: 0,
        createdAt: 0
    }

    await memberRepository.setCooldown(guildId, userId, key, emptyCooldown);
}

export async function setCooldown(guildId: string, userId: string, key: string, cooldown: number): Promise<void> {
    if (cooldown < 0) return;

    const entryCooldown: Cooldown = {
        name: key,
        expiresAt: Date.now() + cooldown,
        createdAt: Date.now()
    }

    await memberRepository.setCooldown(guildId, userId, key, entryCooldown);
}