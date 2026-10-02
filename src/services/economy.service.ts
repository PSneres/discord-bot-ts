import { memberRepository } from "#repositories";

export async function getMoney(guildId: string, userId: string): Promise<number> {
    const memberData = await memberRepository.get(guildId, userId);

    return memberData.money;
}

export async function setMoney(guildId: string, userId: string, value: number): Promise<void> {
    isValidNumber(value);

    await memberRepository.set(guildId, userId, { money: value });
}

export async function addMoney(guildId: string, userId: string, value: number): Promise<void> {
    isValidNumber(value);

    const money = await getMoney(guildId, userId);

    await setMoney(guildId, userId, (money + value));
}

export async function removeMoney(guildId: string, userId: string, value: number) {
    isValidNumber(value);

    const money = await getMoney(guildId, userId);
    const newMoney = Math.max(0, money - value);

    await setMoney(guildId, userId, newMoney);
}

export async function hasMoney(guildId: string, userId: string, value: number): Promise<boolean> {
    const money = await getMoney(guildId, userId);

    return value >= money;
}

export async function getBalance(guildId: string, userId: string): Promise<number> {
    const memberData = await memberRepository.get(guildId, userId);

    return memberData.bank;
}

export async function depositBalance(guildId: string, userId: string, value: number): Promise<void> {
    isValidNumber(value);

    const memberData = await memberRepository.get(guildId, userId);

    if (memberData.money < value) {
        throw new Error(`Economy service error: Insufficient funds: tried to remove ${value}, but only has ${memberData.money}`);
    }

    memberData.money = Math.max(0, memberData.money - value);
    memberData.bank += value;
    
    await memberRepository.set(guildId, userId, memberData);
}

export async function withdrawBalance(guildId: string, userId: string, value: number): Promise<void> {
    isValidNumber(value);

    const memberData = await memberRepository.get(guildId, userId);

    if (memberData.bank < value) {
        throw new Error(`Economy service error: Insufficient funds: tried to remove ${value}, but only has ${memberData.bank}`);
    }


    memberData.bank = Math.max(0, memberData.bank - value);
    memberData.money += value;
    
    await memberRepository.set(guildId, userId, memberData);
}

export async function transferBalance(guildId: string, fromUserId: string, toUserId: string, value: number): Promise<void> {
    const fromMemberData = await memberRepository.get(guildId, fromUserId);
    const toMemberData = await memberRepository.get(guildId, toUserId);

    if (fromMemberData.bank < value) {
        throw new Error(`Economy service error: Insufficient funds: tried to remove ${value}, but only has ${fromMemberData.bank}`);
    }

    if (!fromMemberData.active || !toMemberData.active) {
        throw new Error("Economy service error: Both users must be active in the guild.");
    }

    fromMemberData.bank = Math.max(0, fromMemberData.bank - value);
    toMemberData.bank += value;

    await memberRepository.set(guildId, fromUserId, fromMemberData);
    await memberRepository.set(guildId, toUserId, toMemberData);
}

function isValidNumber(value: number): void {
    if (value < 0) {
        throw new Error("Economy service error: money value must be positive.");
    }
}