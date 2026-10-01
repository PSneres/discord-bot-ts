import { GuildMember } from "discord.js";
import Client from "#client";
import BaseEvent from "#structures/Event.js";
import { setMemberActive } from "#services/xp.service.js";

export default class GuildMemberAdd extends BaseEvent<"guildMemberAdd"> {
    constructor(client: Client) {
       super(client, {
            name: "guildMemberAdd"
       }) 
    }

    async execute(member: GuildMember) {
        if (!member.user.bot) {
            await setMemberActive(member.guild.id, member.id, true);
        }
    }
}