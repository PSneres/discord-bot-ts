import { Guild, GuildMember } from "discord.js";
import { Result } from "../../types/Result.js";

export default async function resolveMember(guild: Guild, target: string): Promise<Result<GuildMember>> {
    const regexId =  /^\d{17,20}$/
    if (!regexId.test(target)) return {
        success:  false,
        error: "Id invalido."
    }

    const member = await guild.members.fetch(target).catch(() => null);

    if (!member) return {
        success: false,
        error: "Id invalido ou o membro não está no servidor."
    }

    return {
        success: true,
        data: member
    }
}