import { Message } from "discord.js";
import Client from "#client";
import BaseEvent from "#structures/Event.js";
import { executeCommand, isCommand } from "#services/prefixCommand.service.js";
import getPrefix from "../utils/client/getPrefix.js";

export default class MessageUpdate extends BaseEvent<"messageUpdate"> {
    constructor(client: Client) {
       super(client, {
            name: "messageUpdate"
       }) 
    }

    async execute(oldMessage: Message<true>, newMessage: Message<true>) {
        if (oldMessage.content !== newMessage.content) {
        const prefix = await getPrefix(newMessage.guild.id);

            if (isCommand(newMessage, prefix)) {
                await executeCommand(this.client, newMessage, prefix);
            } else {
                await this.client.logger.send(newMessage.guild, "messageEdit", {
                    authorId: newMessage.author.id,
                    messageUrl: `https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`,
                    before: oldMessage.content,
                    after: newMessage.content
                })
            }
        }
    }
}