import { Message } from "discord.js";
import Client from "../../client";
import BaseCommand from "../../structures/Command";

export default class PingCommand extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "ping",
            description: "Responde pong",
            aliases: ["p"]
        });
    }

    async execute(message: Message) {
        await message.reply({
            content: "Pong"
        });
    }
}