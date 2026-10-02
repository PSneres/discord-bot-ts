    import { Message, GuildMember } from "discord.js";
    import Client from "#client";
    import Command from "#structures/Command.js";
    import permissionTranslator from "../utils/discord/permissionsTranslator.js"
    import { config } from "#config/constants.js";
    import { remainingTime, setCooldown } from "./cooldown.service.js";
    import getTimestamp from "../utils/discord/getTimestamp.js";

    const BASE_COMMAND_COOLDOWN = 1500;
    
    export function isCommand(message: Message, prefix: string): boolean {
        if (message.author.bot) return false;
        if (message.webhookId) return false;
        if (!message.content.startsWith(prefix)) return false;
        if (!message.guild) return false;

        const content = message.content.slice(prefix.length).trim();
        if (content.length === 0) return false;

        return true;
    }

    export async function executeCommand(client: Client, message: Message, prefix: string): Promise<void> {
        const command: Command | undefined = resolveCommand(client, message, prefix);
        if (!command) return;

        const args = parseArgs(message.content, prefix);

        const remaining = await remainingTime(message.guild!.id, message.author.id, `command/${command.data.name}`);
        if (remaining > 0) {
            return sendError(message, `Aguarde ${getTimestamp(remaining)} antes de usar esse comando novamente.`)
        }

        if (!hasUserPermissions(message, command)) {
            return sendError(message, `Você não tem permissão pra usar esse comando: \`${permissionTranslator(command.data.memberPermissions).join(', ')}\``);
        } 

        if (!hasClientPermissions(message, command, client)) {
            return sendError(message, `Não tenho permissão pra executar esse comando aqui: \`${permissionTranslator(command.data.clientPermissions).join(', ')}\``);
        }

        if (command.data.devOnly && !config.devIds.includes(message.author.id)) return;  //Melhor deixar sem resposta do que dizer que é um comando restritro.

        try {
            await command.execute(message, args);
            await setCooldown(message.guild!.id, message.author.id, `command/${command.data.name}`, command.data.cooldown ?? BASE_COMMAND_COOLDOWN)
        } catch(err) {
            client.logger.error(`Command execute error (${command?.data.name}`, err);
            await sendError(message, "Não foi possivel executar o commando.");
        }
    }

    function resolveCommand(client: Client, message: Message, prefix: string): Command | undefined {
        const messageTextSplited = message.content.slice(prefix.length).trim().split(/\s+/);
        const commandName: string | undefined = messageTextSplited[0]?.toLowerCase();

        if (!commandName) return;

        const command =  client.commands.find((cmd) => 
                cmd.data.name === commandName 
            ||  cmd.data.aliases?.includes(commandName));

        return command;
    }

    function parseArgs(content: string, prefix: string): string[] {
        // Remove prefix, remove unnecessary spaces, separates args, remove command name.
        const args = content.slice(prefix.length).trim().split(/\s+/).slice(1);

        return args;
    }

    async function sendError(message: Message, error:  string): Promise<void> {
    await message.reply({
            content: error
        })
    }

    // function isBlacklisted(userId: string) {}

    function hasUserPermissions(message: Message, command: Command): boolean {
        const member: GuildMember | undefined = message.guild?.members.cache.get(message.author.id);
        if (!member) return false;

        if(!command.data.memberPermissions?.length) return true;

        return command.data.memberPermissions.every((permission) => member.permissions.has(permission));
    }

    function hasClientPermissions(message: Message, command: Command, client: Client): boolean {
        const clientId = client.user?.id
        if (!clientId) return false;

        const clientMember: GuildMember | undefined = message.guild?.members.cache.get(clientId);
        if (!clientMember) return false;

        if (!command.data.clientPermissions?.length) return true;

        return command.data.clientPermissions.every((permission) => clientMember.permissions.has(permission));
    }