import { Message } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { getXpData } from "#services/xp.service";
import Embed from "#structures/Embed";
import { memberRepository } from "#repositories";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "xp",
            description: "Mostra as informações de xp do usuario",
            usage: "<user>",
        });
    }

    async execute(message: Message, args: string[]) {
        const guild = message.guild!;
        const targetId = args[0];
        const mentionedUser = message.mentions.users.first();

        const fetchedMember = targetId && !mentionedUser
            ? await guild.members.fetch(targetId).catch(() => null)
            : null;

        const selfUser = targetId ? null : message.author;
        const user = mentionedUser ?? fetchedMember?.user ?? selfUser;

        if (!user) {
            await message.reply({
                content: "ID ou menção inválida."
            });
            return;
        }

        if(user.bot) {
            await message.reply({
                content: `Não é possivel ver o xp de um bot.`
            })
            return;
        }

        const rankData = await memberRepository.getRank(message.guild!.id, user.id);
        const rank = rankData?.position ?? "Sem rank disponivel";
        const xpData = await getXpData(message.guild!.id, user.id);

        const xpEmbed = new Embed({
            author: {
                name: user.username,
                iconURL: user.displayAvatarURL()
            },
            description: `XP: ${xpData.xp}\nLevel: ${xpData.level + 1}\nPosição no rank: ${rank}`
        })

        await message.reply({
            embeds: [xpEmbed]
        })
    }
}