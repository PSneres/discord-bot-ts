import { GuildMember } from "discord.js";
import { Result } from "../../types/Result.js";
import { ModerationAction } from "../../types/ModerationAction.js";

const CHECK = { ban: "bannable", kick: "kickable", mute: "moderatable" } as const;
const TEXT = { ban: "banir", kick: "expulsar", mute: "mutar" };

export default function checkModerationTarget(authorMember: GuildMember, targetMember: GuildMember, action: ModerationAction): Result {
    if (authorMember.id === targetMember.id) return {
        success: false,
        error: `Você não pode ${TEXT[action]} a si mesmo.`
    };

    if (!targetMember[CHECK[action]]) return {
        success: false,
        error: `Não tenho permissão para ${TEXT[action]} esse membro.`
    };

    if (authorMember.id === authorMember.guild.ownerId) return { success: true };

    if (authorMember.roles.highest.position <= targetMember.roles.highest.position) return {
        success: false,
        error: `Você não tem permissão para ${TEXT[action]} esse membro.`
    };

    return { success: true };
}