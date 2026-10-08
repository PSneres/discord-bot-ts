import type { Config } from "../../types/Config.js";
import { Message } from "discord.js";
import { guildRepository } from "#repositories";

export default {
    name: "logchannel",
    aliases: ["logc"],
    description: "Define o canal de logs",
    value: "#chat",
    async set(message: Message, value: string): Promise<void> {
        const channel = message.mentions.channels.first() || await (message.guild!.channels.fetch(value)).catch(() => null)

        if (!channel) {
            message.reply({
                content: `Mencione ou escreva o id de um canal valido.`
            })
            return;
        }

        const guildData = await guildRepository.set(message.guild!.id, { logChannel: channel.id });

        message.reply({
            content: `Canal de logs definido como: <#${guildData.logChannel}>`
        })
    }
} satisfies Config