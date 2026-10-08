import { Message  } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { addMoney } from "#services/economy.service.js";
import formatNumber from "../../utils/system/formatNumber.js";
import getTimestamp from "../../utils/discord/getTimestamp.js";
import ms from "ms";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "daily",
            description: "Claina seu premio diário",
            cooldown: ms("24h"),
            category: "economia",
        });
    }

    async execute(message: Message) {
        const [MIN, MAX] = [1000, 3500];
        const money = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

        await addMoney(message.guild!.id, message.author.id, money);

        await message.reply({
            content: `Você ganhou ${formatNumber(money)} no seu premio diário, volte em ${getTimestamp(this.data.cooldown!)}  para receber seu premio novamente.`
        })
    }
}