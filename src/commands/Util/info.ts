import { Message } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command";
import Embed from "#structures/Embed";
import getPrefix from "../../utils/client/getPrefix.js";
import permissionTranslator from "../../utils/discord/permissionsTranslator.js"
import capitalize from "../../utils/system/capitalize.js";
import ms from "ms";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "info",
            description: "Mostra as informações de um comando.",
            usage: "<comando>",
            aliases: ["i"],
            category: "util"
        });
    }

    async execute(message: Message, args: string[]) {
        const commandName = args[0];
        if (!commandName) {
            await message.reply({
                content: `Comando invalido. Escreva o nome ou a aliases de um comando para ver a info dele.`
            });
            return;
        }

        const command = this.client.commands.find(({ data }) => data.name === commandName || data.aliases?.includes(commandName));
        if (!command) {
            await message.reply({
                content: `Nome ou aliases de comando invalido.`
            });
            return;
        }
        
        const prefix = await getPrefix(message.guild!.id);
        const memberPermissionsText = command.data.memberPermissions ? `\nPermissões de membro: \`${permissionTranslator(command.data.memberPermissions).join(', ')}\`` : "";
        const clientPermissionsText = command.data.clientPermissions ? `\nPermissões do bot: \`${permissionTranslator(command.data.clientPermissions).join(', ')}\`` : "";
        const cooldownText = command.data.cooldown ? `\nCooldown: ${ms(command.data.cooldown)}` : "";
        const infoEmbed = new Embed({
            title: `Info: ${command.data.name}`,
            description: `Descrição: ${command.data.description}\nAliases: \`${command.data.aliases?.join(", ") || "Sem aliases."}\`\nUso: \`${prefix}${command.data.name} ${command.data.usage ?? ""}\`\nCategoria: ${capitalize(command.data.category)}${memberPermissionsText}${clientPermissionsText}${cooldownText}`
        });

        message.reply({
            embeds: [infoEmbed]
        })
    }
}