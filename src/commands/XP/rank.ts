import { Message } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import Embed from "#structures/Embed.js";
import { memberRepository } from "#repositories";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "rank-xp",
            aliases: ['rankxp', 'rx', 'topxp'],
            description: "Mostra uma pagina do rank.",
            category: "xp",
            usage: "<numero>"
        });
    }

    async execute(message: Message, args: string[]) {
        const page = Number(args[0]);
        if (isNaN(page) &&  args[0]) {
            await message.reply({
                content: `O valor da pagina deve ser um numero.`
            });
            return;
        }

        if ((page > 100 || page <= 0) && args[0]) {
            await message.reply({
                content: `O numero da pagina deve estar entre 1 e 100.`
            });
            return;
        }

        const rank = await memberRepository.topXP(message.guild!.id, page || 1);
        let rankText = "";

        if (rank.members.length <= 0) {
            await message.reply({
                content: `Essa pagina está vazia.`
            });
            return;
        }
        
        for (let i in rank.members) {
            const memberData = rank.members[i];
            if (!memberData) continue;

            const member = await message.guild!.members.fetch(memberData.userId).catch(() => null);
            if (!member) continue; // Type guard only: member activity state is handled in guildMemberAdd/guildMemberRemove.
            
            rankText += `${Number(i) + 1}  - ${member} ${memberData.xp} (${memberData.level + 1})\n`
        }

        const rankEmbed = new Embed({
            title: "Rank de xp",
            description: rankText,
            footer: {
                text: `Pagina ${page || 1}/${rank.totalPages}`
            }
        })

        await message.reply({
            embeds: [rankEmbed]
        })
    }
}