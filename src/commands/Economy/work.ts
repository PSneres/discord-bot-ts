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
            name: "work",
            description: "Trabalha para ganhar um valor em dinheiro.",
            cooldown: ms("1h")
        });
    }

    async execute(message: Message) {
        const [MIN, MAX] = [500, 1000];
        const money = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

        await addMoney(message.guild!.id, message.author.id, money);

        await message.reply({
            content: `Você ganhou ${formatNumber(money)} no seu trabalho, volte em ${getTimestamp(this.data.cooldown!)} para receber seu premio novamente.`
        })
    }
}