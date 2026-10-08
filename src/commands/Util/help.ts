import { Message } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import Embed from "#structures/Embed.js";
import capitalize from "../../utils/system/capitalize.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "help",
            description: "Mostra a lista de comandos.",
            aliases: ["h"],
            category: "util"
        });
    }

    async execute(message: Message) {
        const commands = this.client.commands.filter(({ data }) => !data.devOnly);
        const commandsByCategory: Record<string, BaseCommand[]> = { }
        for (let command of commands) {
            if (!command.data.category) continue;
            (commandsByCategory[command.data.category] ??= []).push(command);
        }
        
        let commandText = "";
        for (let category in commandsByCategory) {
            const commandsList = commandsByCategory[category];
            if (!commandsList) continue; //type guard

            commandText += `## ${capitalize(category)}\n\`${commandsList.map(({ data }) => data.name).join(", ")}\`\n`;
        }

        const helpEmbed = new Embed({
            title: `Comandos disponíveis.`,
            description: commandText + "\n-# Utilize o comando info para saber a informação de algum comando.",
        });

        await message.reply({
            embeds: [helpEmbed]
        });
    }
}