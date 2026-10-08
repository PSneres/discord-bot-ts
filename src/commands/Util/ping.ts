import { Message } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "ping",
            description: "Responde pong",
            aliases: ["p"],
            category: "util"
        });
    }

    async execute(message: Message) {
        const ping = Date.now() - message.createdTimestamp;

        await message.reply({
            content: `Meu ping atual é ${ping}ms`
        });
    }
}