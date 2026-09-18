import Client from "../../client";
import BaseCommand from "../../structures/Command";
import { readdirSync } from "fs";
import { pathToFileURL } from "node:url";

const COMMAND_PATH = "./src/commands";

export default async function loadCommands(client: Client): Promise<BaseCommand[]> {
    const commands: BaseCommand[] = [];
    const categoryFiles = readdirSync(COMMAND_PATH);

    for (const category of categoryFiles) {
        if (category.endsWith('.ts')) continue;
        const commandFiles = readdirSync(`${COMMAND_PATH}/${category}`);

        for (const fileName of commandFiles) {
            const commandPathURL = pathToFileURL(`${COMMAND_PATH}/${category}/${fileName}`).href
            const { default: Command } = await import(commandPathURL);

            const command = new Command(client)
            commands.push(command);
        }
    }
    
    client.logger.info(`Commands loaded: ${commands.length} commands registered`);
    return commands;
}