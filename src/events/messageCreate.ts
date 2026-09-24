import { Message } from "discord.js";
import Client from "../client";
import BaseEvent from "../structures/Event";
import { executeCommand, isCommand } from "../services/prefixCommand.service";
import { config } from "../config/constants";
import { guildRepository } from "../database/repositories";

export default class MessageCreate extends BaseEvent<"messageCreate"> {
    constructor(client: Client) {
       super(client, {
            name: "messageCreate"
       }) 
    }

    async execute(message: Message) {
        if (message.guild) {
            const guildData = await guildRepository.get(message.guild.id);
            const prefix: string = guildData.prefix ?? config.prefix;

            if (isCommand(message, prefix)) {
                await executeCommand(this.client, message, prefix);
            }
        }
    }
}