import { Message } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "test",
            category: "dev",
            devOnly: true
        });
    }

    async execute(_message: Message) {
        // nothing here
    }
}