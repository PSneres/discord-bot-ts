import type { Config } from "../../types/Config.js";
import { Message } from "discord.js";
import { guildRepository } from "#repositories";

export default {
    name: "prefix",
    aliases: ["p"],
    description: "Define o meu prefixo.",
    value: "<text>",
    async set(message: Message, value:  string): Promise<void> {
        if (!value) {
            message.reply({
                content: `Prefixo invalido: por favor escreva um prefixo.`
            });
            return;
        }
            
        if (value.length > 5) {
            await message.reply({
                    content: `Prefixo invalido: o prefixo não pode ter mais que 5 caracteres.`
                });
            return;
        }
                    
        const guildData = await guildRepository.set(message.guild!.id, { prefix: value });
            
        await message.reply({
                content: `Prefixo setado com sucesso! Novo prefixo: \`${guildData.prefix}\``
        })
    }
} satisfies Config