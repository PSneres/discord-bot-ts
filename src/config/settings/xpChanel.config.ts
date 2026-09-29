import type { Config } from "../../types/Config.js";
import { Message } from "discord.js";
import { guildRepository } from "#repositories";

export default {
    name: "xpchannel",
    aliases: ["xpc"],
    description: "Define o canal de notificações do XP",
    value: "#chat",
    async set(message: Message, value: string): Promise<void> {
        const channel = message.mentions.channels.first() || message.guild!.channels.cache.get(value) 

        if (!channel) {
            message.reply({
                content: `Mencione ou escreva o id de um canal valido.`
            })
            return;
        }

        const guildData = await guildRepository.set(message.guild!.id, { xpChannel: channel.id });

        message.reply({
            content: `Canal de notificações de XP definido como: <#${guildData.xpChannel}>`
        })
    }
} satisfies Config