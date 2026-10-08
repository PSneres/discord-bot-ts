import { Message, User } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import Embed from "#structures/Embed";
import { getMoney, getBalance } from "#services/economy.service.js";
import getUser from "../../utils/discord/getUser.js";
import formatNumber from "../../utils/system/formatNumber.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "money",
            aliases: ["atm", "wallet", "cash"],
            description: "Mostra o dinheiro de um usuário",
            usage: "<user>",
            category: "economia",
        });
    }

    async execute(message: Message, args: string[]) {
        const guild = message.guild!;
        const user: User | null = await getUser(message, args[0]);

        if (!user) {
            await message.reply({
                content: "ID ou menção inválida."
            });
            return;
        }

        if(user.bot) {
            await message.reply({
                content: `Não é possivel ver o dinheiro de um bot.`
            })
            return;
        }

        const money = await getMoney(guild.id, user.id);
        const balance = await getBalance(guild.id, user.id);

        const atmEmbed = new Embed({
            author: {
                name: `Dinheiro do(a) ${user.username}`,
                iconURL: user.displayAvatarURL()
            },
            description: `Money: ${formatNumber(money)}\nBanco: ${formatNumber(balance)}`
        });

        await message.reply({
            embeds: [atmEmbed]
        })
    }
}