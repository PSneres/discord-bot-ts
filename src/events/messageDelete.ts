import { Message } from "discord.js";
import Client from "#client";
import BaseEvent from "#structures/Event.js";
export default class MessageUpdate extends BaseEvent<"messageDelete"> {
    constructor(client: Client) {
       super(client, {
            name: "messageDelete"
       }) 
    }

    async execute(message:  Message<true>) {
        await this.client.logger.send(message.guild, "messageDelete", {
            authorId: message.author.id,
            content: message.content,
        })
    }
}