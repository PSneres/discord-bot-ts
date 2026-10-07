import { Message, PermissionFlagsBits } from "discord.js";
import Client from "#client";
import BaseCommand from "#structures/Command";
import resolveTarget from "../../utils/discord/resolveTarget.js";

export default class extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "unmute",
            description: "Remove o mute de um membro do servidor.",
            usage: "<membro> <motivo>",
            memberPermissions: [ PermissionFlagsBits.ModerateMembers ],
            clientPermissions: [ PermissionFlagsBits.ModerateMembers ]
        });
    }

    async execute(message: Message, args: string[]) {
        const target = args[0];
        const reason = args.slice(1).join(" ");

        if (!target || !reason) {
            await message.reply({
                content: `Comando inválido. Use: unmute ${this.data.usage}.`
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

        await targetMember.timeout(null, `${message.author.username} (${message.author.id}) - ${reason}`);
        await message.reply({
            content: `O membro ${targetMember.user.username} (${targetMember.id}) foi desmutado com sucesso.`
        });
        // logManager send <member X unmuted reason Y>
    }
}
