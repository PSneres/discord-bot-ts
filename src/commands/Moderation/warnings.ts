import { Message, User } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command";
import { getWarns } from "#services/warns.service.js";
import Embed from "#structures/Embed";
import getTimestamp from "../../utils/discord/getTimestamp.js";
import getUser from "../../utils/discord/getUser.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "warnings",
            category: "moderação",
            usage: "<membro>",
            description: "Vê os warns ativos e inativos de um membro",
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
                content: `Não é possivel ver o warns de um bot.`
            })
            return;
        }

        const warns = await getWarns(message.guild!.id, user.id) ?? [];
        let warnsText = "";
        for (const warn of warns) {
            const createdAt = getTimestamp(Math.floor(warn.createdAt.getTime() / 1000));
            const removedAt = warn.removedAt ? getTimestamp(Math.floor(warn.removedAt.getTime() / 1000)) : "Não removido."
            const member = await message.guild!.members.fetch(warn.moderatorId).catch(() => null) ?? "Não encontrado."

            warnsText += `\n${warn._id} - ${warn.reason}\n - Criado: ${createdAt}\n - Removido: ${removedAt}\n - Moderador: ${member}`
        }

        const warnCount = warns.filter(({ removedAt }) => !removedAt).length
        const warnsEmbed = new Embed({
            author: {
                name: `Warns ${user.username} - ${warnCount}/3`,
                iconURL: user.displayAvatarURL()
            },
            description: warnsText || `${user.username} não possui warns`,
            footer: {
                text: "Para revogar um warn converse com um administrador."
            }
        });

        await message.reply({
            embeds: [warnsEmbed]
        });
    }
}