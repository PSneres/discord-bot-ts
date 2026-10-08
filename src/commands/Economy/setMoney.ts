import { Message, PermissionFlagsBits, User } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { setMoney } from "#services/economy.service.js";
import { memberRepository } from "#repositories";
import getUser from "../../utils/discord/getUser.js";
import formatNumber from "../../utils/system/formatNumber.js";
import parseAmount from "../../utils/system/parseAmount.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "setmoney",
            description: "Define o dinheiro de um ou todos os usuários salvos..",
            usage: "<member ou all> <money>",
            category: "economia",
            memberPermissions: [
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.ManageGuild
            ]
        });
    }

    async execute(message: Message, args: string[]) {
        if (!args[0] || !args[1]) {
            await message.reply({
                content: "Comando invalido. Use setmoney <user ou id> <numero>"
            });
            return;
        }
        const targetId = args[0];
        const money = Number(args[1]) || parseAmount(args[1]);

        if (!targetId || !Number.isSafeInteger(money)) {
            await message.reply({
                content: "Comando invalido. Uso correto: `setmoney <membro | all> <money>` (ex: set xp @Fulano 500)"
            })
            return;
        }

        if (money < 0) {
            await message.reply({
                content: `O numero do dinheiro não pode ser negativo.`
            });
            return;
        }

        if (targetId === "all") {
            await memberRepository.setGuild(message.guild!.id, { money });

            await message.reply({
                content: `O dinheiro de todos os usuários salvos nesse servidor foi definido como ${formatNumber(money)}.`
            })
            return; 
        }

        const user: User | null = await getUser(message, targetId);

        if (!user) {
            await message.reply({
                content: "Você precisa mencionar ou escrever um id valido."
            });
            return;
        }

        if (user.bot) {
            await message.reply({
                content: "Não é possivel adicionar dinheiro a um bot."
            })
            return;
        }

        await setMoney(message.guild!.id, user.id, money);

        await message.reply({
            content: `O dinheiro do usuário ${user.username} (${user.id}) definido como ${formatNumber(money)} com sucesso.`
        })
    }
}