import { memberRepository } from "#repositories";
import { Warn } from "../types/Warn.js";
import { Result } from "../types/Result.js";

export async function addWarn(guildId: string, userId: string, moderatorId: string, reason: string): Promise<number> {
    const memberData = await memberRepository.get(guildId, userId);
    
    const warns = memberData.warns as Warn[];
    const id: number = warns.length;

    warns.push({
        _id: id,
        reason,
        createdAt: new Date(),
        moderatorId,
        removedAt: null
    });

    await memberRepository.set(guildId, userId, memberData);

    const activeCount = warns.filter(({ removedAt }) => !removedAt).length
    return activeCount;
}

export async function getWarns(guildId: string, userId: string): Promise<Warn[]> {
    const memberData = await memberRepository.get(guildId, userId);
    
    const warns = memberData.warns as Warn[];

    return warns;
}

export async function getWarn(guildId: string, userId: string, warnId: number): Promise<Warn | undefined> {
    const warns: Warn[] = await getWarns(guildId, userId);

    const warn = warns.find(({ _id }) => _id === warnId);

    return warn;
}

export async function removeWarn(guildId: string, userId: string, warnId: number): Promise<Result> {
    const memberData = await memberRepository.get(guildId, userId);
    
    const warns = memberData.warns as Warn[];
    const warn = warns.find(({ _id, removedAt }) => _id === warnId && !removedAt);
    
    if (!warn) return {
        success: false,
        error: "Warn não encontrado ou já removido."
    };

    warn.removedAt = new Date();
    await memberRepository.set(guildId, userId, memberData);

    return { success: true };
}