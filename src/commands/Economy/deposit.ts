import { Message } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { getMoney, depositBalance } from "#services/economy.service.js";
import parseAmount from "../../utils/system/parseAmount.js";
import formatNumber from "../../utils/system/formatNumber.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "deposit",
            aliases: ["dep",  "bank"],
            description: "Deposita o dinheiro no banco",
            usage: "<money>",
        });
    }

    async execute(message: Message, args: string[]) {
        if (!args[0]) {
            await message.reply({
                content: "Comando invalido. Use `deposit <numero>`"
            });
            return;
        }

        const depositValue = Number(args[0]) || parseAmount(args[0]);

        if (!Number.isSafeInteger(depositValue)) {
            await message.reply({
                content: "O valor do dinheiro precisa ser um numero"
            })
            return;
        }

        if (depositValue <= 0) {
            await message.reply({
                content: "O valor deve ser maior que 0"
            });
            return;
        }

        const money = await getMoney(message.guild!.id, message.author.id);

        if (money < depositValue) {
            await message.reply({
                content: `Você não tem dinheiro para isso: seu dinheiro atual \`${formatNumber(money)}\``,
            });
            return;
        };

        await depositBalance(message.guild!.id, message.author.id, depositValue);

        await message.reply({
            content: `Valor depositado com sucesso, valor: \`${formatNumber(depositValue)}\``
        });
    }  
}