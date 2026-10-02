import { Message } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { withdrawBalance, getBalance } from "#services/economy.service.js";
import parseAmount from "../../utils/system/parseAmount.js";
import formatNumber from "../../utils/system/formatNumber.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "withdraw",
            aliases: ["draw"],
            description: "Saca seu dinheiro do banco",
            usage: "<money>",
        });
    }

    async execute(message: Message, args: string[]) {
        if (!args[0]) {
            await message.reply({
                content: "Comando invalido. Use `withdraw <numero>`"
            });
            return;
        }

        const withdrawValue = Number(args[0]) || parseAmount(args[0]);
        if (!Number.isSafeInteger(withdrawValue)) {
            await message.reply({
                content: "O valor do dinheiro precisa ser um numero"
            })
            return;
        }

        if (withdrawValue <= 0) {
            await message.reply({
                content: "O valor deve ser maior que 0"
            });
            return;
        }

        const bank = await getBalance(message.guild!.id, message.author.id);

        if (bank < withdrawValue) {
            await message.reply({
                content: `Você não tem dinheiro para isso: seu dinheiro atual \`${formatNumber(bank)}\``,
            });
            return;
        };

        await withdrawBalance(message.guild!.id, message.author.id, withdrawValue);

        await message.reply({
            content: `Valor sacado com sucesso, valor: \`${formatNumber(withdrawValue)}\``
        });
    }
}