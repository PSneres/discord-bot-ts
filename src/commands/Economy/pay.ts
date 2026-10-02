import { Message } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { transferBalance } from "#services/economy.service.js";
import formatNumber from "../../utils/system/formatNumber.js";
import { memberRepository } from "#repositories";
import parseAmount from "../../utils/system/parseAmount.js";
const MAX_TRANSFER_VALUE: number = 1000000000;

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "pay",
            aliases: ['transfer'],
            description: "Transfere um valor do seu banco para outro usuário.",
            usage: "<user> <numero>",
        });
    }

    async execute(message: Message, args: string[]) {
        if (!args[0] || !args[1]) {
            await message.reply({ 
                content: "Uso correto: `.pay <user> <valor>`" 
            });
            return;
        }

        const targetId = args[0];
        const money = Number(args[1]) || parseAmount(args[1]);

        if (!Number.isSafeInteger(money)) {
            await message.reply({
                content: "O valor do dinheiro deve ser um numero inteiro."
            });
            return;
        }

        if (money <= 0 || money > MAX_TRANSFER_VALUE) {
            await message.reply({
                content: `O valor de transferencia deve estar entre \`1 e ${formatNumber(MAX_TRANSFER_VALUE)}\``
            })
            return;
        }

        const mentionedUser = message.mentions.users.first();
        const fetchedMember = targetId && !mentionedUser
                ? await message.guild!.members.fetch(targetId).catch(() => null)
                : null;

        const user = mentionedUser ?? fetchedMember?.user 

        if (!user) {
            await message.reply({
                content: "Mencione um usuário valido."
            })
            return;
        }

        if (user.bot) {
            await message.reply({
                content: "Você não pode transferir dinheiro para um bot",
            });
            return;
        }

        if (user.id === message.author.id) {
            await message.reply({
                content: "Você não pode transferir dinheiro para si mesmo."
            })
            return;
        }

        const member = await message.guild!.members.fetch(user.id).catch(() => null);

        if (!member) {
            await message.reply({
                content: "O usuário deve estar no servidor."
            })
            return;
        }

        const fromUserData = await memberRepository.get(message.guild!.id, message.author.id);
        const toUserData = await memberRepository.get(message.guild!.id, user.id);

        if (!fromUserData.active || !toUserData.active) {
            await message.reply({
                content: "Ambos os usuários devem estar presentes no servidor. (ativos)"
            })
            return;
        }

        if (fromUserData.bank < money) {
            await message.reply({
                content: `Você não tem esse valor no banco: valor atual \`${formatNumber(fromUserData.bank)}\``
            });
            return;
        }

        await transferBalance(message.guild!.id, message.author.id, user.id, money);

        await message.reply({
            content: `Valor transferido com sucesso, ${message.author.username} transferiu ${formatNumber(money)} para ${user.username}`
        });
    }
}