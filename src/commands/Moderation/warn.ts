import { Message, PermissionFlagsBits } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command.js";
import resolveTarget from "../../utils/discord/resolveTarget.js";
import { addWarn, removeWarn } from "#services/warns.service.js";
import Embed from "#structures/Embed.js";
const MAX_WARN_COUNT: number = 3;

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "warn",
            description: "Administra os warns dos membros do servidor.",
            usage: "<add ou remove> <membro> <motivo ou warn_id>",
            category: "moderação",
            memberPermissions: [ PermissionFlagsBits.BanMembers ],
            clientPermissions: [ PermissionFlagsBits.BanMembers ]
        });
    }

    async execute(message: Message, args: string[]) {
        const action = args[0];

        if (action === "add") return this.add(message, args.slice(1));
        if (action === "remove") return this.remove(message, args.slice(1));

        await message.reply({ content: `Comando inválido. Use: warn ${this.data.usage}.` });
    }

    private async add(message: Message, args: string[]) {
        const guild = message.guild!;
        const target = args[0];
        const reason = args.slice(1).join(" ");
        if (!target || !reason) {
            await message.reply({
                content: `Comando inválido. Use: warn add <membro> <motivo>.`
            });
            return;
        }

        const authorMember = message.member!;

        const memberResult = await resolveTarget({
            target: message.mentions.members?.first()?.id ?? target,
            action: "ban",
            guild,
            authorMember,
        });

        if (!memberResult.success) {
            await message.reply({
                content: memberResult.error
            });
            return;
        }

        const targetMember = memberResult.data;

        const warnsCount = await addWarn(guild.id, targetMember.id, message.author.id, reason);

        const warnEmbed = new Embed({
            author: {
                name: `Warns: ${warnsCount}/${MAX_WARN_COUNT}`,
                iconURL: targetMember.user.displayAvatarURL()
            },
            description: `Você recebeu um warn pelo ${message.author} (${message.author.id}) no servidor ${guild.name} \nMotivo: ${reason}${warnsCount >= MAX_WARN_COUNT ? " e foi banido." : ""}`
        });

        let dmFailed: boolean = false;
        await targetMember.send({
            embeds: [warnEmbed]
        }).catch(() => dmFailed = true);

        if (warnsCount >= MAX_WARN_COUNT) {
            await targetMember.ban({ reason: `${message.author.username} (${message.author.id}) - ${reason}` });

            await message.reply({
                content: `O membro ${targetMember.user.username} (${targetMember.id}) atingiu o limite de \`${MAX_WARN_COUNT}\` warns e foi banido.${dmFailed ? `\nNão foi possível enviar a mensagem para o membro.` : ""}`
            });
            await this.client.logger.send(message.guild!, "ban", {
                moderatorId:  authorMember.id,
                targetId: targetMember.id,
                reason
            });
            return;
        }

        await message.reply({
            content: `O membro ${targetMember.user.username} (${targetMember.id}) recebeu um warn com sucesso: ${warnsCount}/\`${MAX_WARN_COUNT}\`${dmFailed ? `\nNão foi possível enviar a mensagem para o membro. recomendo que você o avise sobre.` : ""}`
        });
        
        await this.client.logger.send(message.guild!, "warn", {
                moderatorId:  authorMember.id,
                targetId: targetMember.id,
                reason
        });
     }
    private async remove(message: Message, args: string[]) { 
        const guild = message.guild!;
        const target = args[0];
        const warnId = Number(args[1]);

        if (!target) {
            await message.reply({
                content: `Comando inválido. Use: warn remove <membro> <warn_id>.`
            });
            return;
        }

        if (!Number.isInteger(warnId)) {
            await message.reply({
                content: `O id do warn deve ser um número.`
            });
            return;
        }

        const authorMember = message.member!;

        const memberResult = await resolveTarget({
            target: message.mentions.members?.first()?.id ?? target,
            action: "ban",
            guild,
            authorMember,
        });

        if (!memberResult.success) {
            await message.reply({
                content: memberResult.error
            });
            return;
        }

        const targetMember = memberResult.data;

        const warnResult = await removeWarn(guild.id, targetMember.id, warnId);

        if (!warnResult.success) {
            await message.reply({
                content: warnResult.error
            });
            return;
        }

        await message.reply({
            content: `O warn foi removido com sucesso do usuário ${targetMember.user.username} (${targetMember.id})`
        });
        await this.client.logger.send(message.guild!, "unwarn", {
            moderatorId:  authorMember.id,
            targetId: targetMember.id,
            warnId
        });
    }
}