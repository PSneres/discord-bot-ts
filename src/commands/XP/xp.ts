import { Message, User } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { getXpData } from "#services/xp.service.js";
import Embed from "#structures/Embed.js";
import { memberRepository } from "#repositories";
import getUser from "../../utils/discord/getUser.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "xp",
            description: "Mostra as informações de xp do usuario",
            usage: "<user>",
            category: "xp",
        });
    }

    async execute(message: Message, args: string[]) {
        const user: User | null = await getUser(message, args[0]);

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