import { Message } from "discord.js";
import { memberRepository } from "#repositories";
import { remainingTime, setCooldown } from "./cooldown.service.js";

/// Random XP gained per message (min, max) 
const XP_GAIN_RANGE: [number, number] = [3, 5];
const XP_COOLDOWN: number = 1000;
const LEVEL_UP_XP: number = 1000;

export async function canReciveXP(message: Message, prefix: string): Promise<boolean> {
    if (!message.guild || !message.member) return false;
    if (message.author.bot) return false;
    if (message.webhookId) return false;
    if (message.content.length < 4) return false;
    if (message.content.trim().length <= 0) return false;
    if (message.content.startsWith(prefix)) return false;

    const remaining = await remainingTime(message.guild.id, message.author.id, "xp");
    if (remaining <= 0) return false;

    return true;
}

export async function grantXP(guildId: string, userId: string, xp: number = randomXP()): Promise<void> {
    const memberData = await memberRepository.get(guildId, userId);
    
    memberData.xp += xp;
    memberData.level = calculateLevel(memberData.xp);

    await setCooldown(guildId, userId, "xp", XP_COOLDOWN)

    if (isLevelUp(memberData.xp, memberData.xp - xp)) {

    }

    await memberRepository.set(guildId, userId, memberData);
}

export async function deductXP(guildId: string, userId: string, xp: number): Promise<void> {
    const memberData = await memberRepository.get(guildId, userId);

    memberData.xp = Math.max(0, memberData.xp - xp);
    memberData.level = calculateLevel(memberData.xp);

    await memberRepository.set(guildId, userId, memberData);
}

export async function setXP(guildId:  string, userId: string, xp: number): Promise<void> {
    const memberData = await memberRepository.get(guildId, userId);

    memberData.xp = xp
    memberData.level = calculateLevel(memberData.xp);

    await memberRepository.set(guildId, userId, memberData);
}

function randomXP(): number {
    const [min, max] = XP_GAIN_RANGE;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isLevelUp(newXp: number, oldXp: number): boolean {
    return calculateLevel(newXp) > calculateLevel(oldXp);
}

function calculateLevel(xp: number): number {
    return Math.floor(xp / LEVEL_UP_XP);
}