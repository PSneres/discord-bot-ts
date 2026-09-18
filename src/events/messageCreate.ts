import { Message } from "discord.js";
import Client from "../client";
import BaseEvent from "../structures/Event";
import { executeCommand, isCommand } from "../services/prefixCommand.service";

export default class MessageCreate extends BaseEvent<"messageCreate"> {
    constructor(client: Client) {
       super(client, {
            name: "messageCreate"
       }) 
    }

    async execute(message: Message) {
        if (isCommand(message)) {
            await executeCommand(this.client, message);
        }
    }
}