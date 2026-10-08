import { Message, PermissionFlagsBits } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command";
import resolveTarget from "../../utils/discord/resolveTarget.js";
import ms, { StringValue } from "ms";
const MAX_TIMEOUT = 20 * 24 * 60 * 60 * 1000; // 20 days

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "mute",
            description: "Muta um membro do servidor.",
            usage: "<membro> <tempo> <motivo>",
            cooldown: ms("30s"),
            category: "moderação",
            memberPermissions: [ PermissionFlagsBits.ModerateMembers ],
            clientPermissions: [ PermissionFlagsBits.ModerateMembers ]
        });
    }

    async execute(message: Message, args: string[]) {
        const target = args[0];
        const timeText = args[1];
        const reason = args.slice(2).join(" ");

        if (!target || !timeText || !reason) {
            await message.reply({
                content: `Comando inválido. Use: mute ${this.data.usage}.`
            });
            return;
        }

        const timeRegex = /^[1-9]\d?[smhd]$/i;
        if (!timeRegex.test(timeText)) {
            await message.reply({
                content: `O tempo deve seguir o seguinte padrão: \`1m\`,\`20h\`,\`3d\``
            });
            return;
        }
        const time = ms(timeText as StringValue);

        if (time > MAX_TIMEOUT) {
            await message.reply({
                content: `O tempo do mute deve estar entre 1s e ${ms(MAX_TIMEOUT)}.`
            });
            return;
        }

        const authorMember = message.member!;

        const memberResult = await resolveTarget({
            guild: message.guild!,
            target: message.mentions.members?.first()?.id ?? target,
            authorMember,
            action: "mute"
        });

        if (!memberResult.success) {
            await message.reply({
                content: memberResult.error
            });
            return;
        }

        const targetMember = memberResult.data;

        await targetMember.timeout(time, `${message.author.username} (${message.author.id}) - ${reason}`);
        await message.reply({
            content: `O membro ${targetMember.user.username} (${targetMember.id}) foi mutado por \`${timeText}\` com sucesso.`
        });
        await this.client.logger.send(message.guild!, "timeout", {
            moderatorId:  authorMember.id,
            targetId: targetMember.id,
            reason
        });
    }
}
