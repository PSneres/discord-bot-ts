import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { Message } from "discord.js";
import { PermissionFlagsBits } from "discord.js";
import { loadedConfigs, executeConfig } from "../../config/settings/index.js";
import Embed from "#structures/Embed.js"

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "config",
            description: "Define as configurações gerais do servidor.",
            usage: "<set ou remove> <nome da configuração> <args>",
            category: "configs",
            memberPermissions: [ 
                PermissionFlagsBits.ManageMessages, 
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ManageGuild
             ]
        });
    }

    async execute(message: Message, args: string[]) {
        if (args.length <= 0) {
            let description = "";

            for (let config of loadedConfigs) {
                const hasSet = typeof config.set === "function";
                const hasRemove = typeof config.remove === "function";
                const actionsList = [
                    hasSet && "set",
                    hasRemove && "remove",
                ].filter(Boolean).join(", ");

                const aliasesText = config.aliases ? `(${config.aliases.join(", ")})` : "";
                description += `- ${config.name}  ${aliasesText} - ${actionsList} - \`${config.value ?? "Sem valor esperado"}\`\n    ${config.description}\n`
            }
            
            const embed = new Embed({
                title: "Lista de Configs",
                description: `${description}\n\n-# Obs: os argumentos são necessários só para o set; o remove não utiliza.`,
                footer: {
                    text: " ",
                    iconURL: message.author.displayAvatarURL()
                }
            })

            message.reply({
                embeds: [embed]
            })
            
            return;
        }

        await executeConfig(message, args);
    }
}