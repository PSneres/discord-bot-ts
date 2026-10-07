import { Message, PermissionFlagsBits, TextChannel } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command";
import ms, { StringValue } from "ms";
const MAX_SLOWMODE = 6 * 60 * 60 * 1000; // 6h

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "slowmode",
            aliases: ["sm"],
            description: "Define o tempo de espera de um chat.",
            usage: "<tempo>",
            memberPermissions: [ PermissionFlagsBits.ManageChannels ],
            clientPermissions: [ PermissionFlagsBits.ManageChannels ]
        });
    }

    async execute(message: Message, args: string[]) {
        const timeText = args[0];
        const timeRegex = /^[0-9]\d?[smh]$/i

        if (!timeText || !timeRegex.test(timeText)) {
            await message.reply({
                content: `Escreva um tempo valido conforme o padrão: \`10m\`, \`12s\`, \`5h\``
            });
            return;
        }
        const time = ms(timeText as StringValue)

        if (time < 0 || time > MAX_SLOWMODE) {
            await message.reply({
                content: `Escreva um tempo entre 0 e 6h`
            });
            return;
        }

        const channel = message.channel as TextChannel;
        await channel.setRateLimitPerUser(~~(time / 1000), `Slowmode definido por ${message.author.username}`);

        await message.reply({
            content: `Slowmode definido para \`${ms(time)}\` neste canal.`
        });
    }
}