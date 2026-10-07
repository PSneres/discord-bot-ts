import { Guild, GuildMember } from "discord.js";
import { ModerationAction } from "../../types/ModerationAction.js";
import { Result } from "../../types/Result.js";
import resolveMember from "./resolveMember.js";
import checkModerationTarget from "./checkModerationTarget.js";

interface ResolveParams {
    guild: Guild, 
    target: string,
    authorMember: GuildMember,
    action: ModerationAction
}

export default async function resolveTarget({ guild, target, authorMember, action }: ResolveParams): Promise<Result<GuildMember>> {
    const memberResult = await resolveMember(guild, target);

    if (!memberResult.success) return memberResult;

    const targetMember = memberResult.data;
    const checkResult = checkModerationTarget(authorMember, targetMember, action);

    if (!checkResult.success) return checkResult;

    return {
        success: true,
        data: targetMember
    };
}