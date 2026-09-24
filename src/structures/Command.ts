import { Interaction, Message, PermissionResolvable } from "discord.js";
import Client from "../client";

interface CommandData {
        name: string,
        description?: string,
        aliases?: string[],
        usage?: string,
        category?: string,
        memberPermissions?: PermissionResolvable[],
        clientPermissions?: PermissionResolvable[],
        devOnly?: boolean,
}

interface CommandOptions {
    client: Client
    data: CommandData
}

type commmandContext = Message | Interaction

export default abstract class BaseCommand implements CommandOptions {
    constructor(
        public readonly client: Client,
        public readonly data: CommandData
    ) {}

    abstract execute(context: commmandContext, args?: string[]): Promise<void>
}