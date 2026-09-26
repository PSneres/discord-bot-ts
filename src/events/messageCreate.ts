import { Message } from "discord.js";
import Client from "#client";
import BaseEvent from "#structures/Event.js";
import { executeCommand, isCommand } from "#services/prefixCommand.service.js";
import { grantXP, canReciveXP } from "#services/xp.service.js";
import getPrefix from "../utils/client/getPrefix.js";

export default class MessageCreate extends BaseEvent<"messageCreate"> {
    constructor(client: Client) {
       super(client, {
            name: "messageCreate"
       }) 
    }

    async execute(message: Message) {
        if (message.guild) {
            const prefix = await getPrefix(message.guild.id);

            if (isCommand(message, prefix)) {
                await executeCommand(this.client, message, prefix);
            }

            if ((await canReciveXP(message, prefix))) {
                await grantXP(message.guild.id, message.author.id);
            }
        }
    }
}