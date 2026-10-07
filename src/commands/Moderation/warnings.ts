import { Message } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command";
import { getWarns } from "#services/warns.service.js";
import Embed from "#structures/Embed";
import getTimestamp from "../../utils/discord/getTimestamp.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "warnings",
            description: "Vê os seus warns ativos e inativos.",
        });
    }

    async execute(message: Message) {
        const warns = await getWarns(message.guild!.id, message.author.id) ?? [];
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
                name: `Warns ${message.author.username} - ${warnCount}/3`,
                iconURL: message.author.displayAvatarURL()
            },
            description: warnsText || "Você não possui warns",
            footer: {
                text: "Para revogar um warn converse com um administrador."
            }
        });

        await message.reply({
            embeds: [warnsEmbed]
        });
    }
}