import { GuildMember } from "discord.js";
import Client from "#client";
import BaseEvent from "#structures/Event.js";
import { setMemberActive } from "#services/xp.service.js";

export default class GuildMemberRemove extends BaseEvent<"guildMemberRemove"> {
    constructor(client: Client) {
       super(client, {
            name: "guildMemberRemove"
       }) 
    }

    async execute(member: GuildMember) {
        if (!member.user.bot) {
            await setMemberActive(member.guild.id, member.id, false);
        }
    }
}