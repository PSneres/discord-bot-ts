import { Message, User } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { setXP } from "#services/xp.service.js";

export default class TestCommand extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "setxp",
            devOnly: true
        });
    }

    async execute(message: Message, args: string[]) {
        const xp = Number(args[1]);
        const id = args[0]
        if(!id || isNaN(xp)) {
            await message.reply({ content: `id ou xp` });
            return;
        }

        const user: User | undefined = message.mentions.users.first() ?? this.client.users.cache.get(id)
        if (!user) {
          await message.reply({ content: `user`});
          return;
        }

        await setXP(message.guild!.id, user.id, xp);

        message.reply({
            content: `XP do usuario ${user}, definido como ${xp} com sucesso`
        })
    }
}