import { Message, PermissionFlagsBits, User } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { setXP } from "#services/xp.service.js";
import { memberRepository } from "#repositories";
import getUser from "../../utils/discord/getUser.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "setxp",
            description: "Define o xp de um ou todos os usuários do servidor.",
            usage: "<member ou all> <xp>",
            category: "xp",
            memberPermissions: [
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.ManageGuild
            ]
        });
    }

    async execute(message: Message, args: string[]) {
        const targetId = args[0];
        const xp = Number(args[1]);

        if (!targetId || isNaN(xp)) {
            await message.reply({
                content: "Comando invalido. Uso correto: `setxp <membro | all> <xp>` (ex: set xp @Fulano 500)"
            })
            return;
        }

        if (xp < 0) {
            await message.reply({
                content: `O numero do xp não pode ser negativo.`
            });
            return;
        }

        if (targetId === "all") {
            await memberRepository.setGuild(message.guild!.id, { xp });

            await message.reply({
                content: `XP de todos os usuários salvos nesse servidor foi definido como ${xp}.`
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
                content: "Não é possivel adicionar xp a um bot."
            })
            return;
        }

        await setXP(message.guild!.id, user.id, xp);

        await message.reply({
            content: `XP do usuário ${user.username} (${user.id}) definido como ${xp} com sucesso.`
        })
    }
}