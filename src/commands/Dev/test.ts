import { Message } from "discord.js";
import Client from "../../client";
import BaseCommand from "../../structures/Command";
import { memberRepository, guildRepository } from "../../database/repositories";

export default class TestCommand extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "test",
            devOnly: true
        });
    }

    async execute(_message: Message) {
        console.log(memberRepository, guildRepository);
    }
}