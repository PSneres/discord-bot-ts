import Client from "#client";
import BaseCommand from "#structures/Command.js";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const COMMAND_PATH = join(dirname(fileURLToPath(import.meta.url)), "../../commands");

const isCommandFile = (file: string) =>
    /\.(ts|js)$/.test(file) && !file.endsWith(".d.ts");

export default async function loadCommands(client: Client): Promise<BaseCommand[]> {
    const commands: BaseCommand[] = [];
    const categories = readdirSync(COMMAND_PATH, { withFileTypes: true })
        .filter((entry) => entry.isDirectory());

    for (const category of categories) {
        const categoryPath = join(COMMAND_PATH, category.name);
        const commandFiles = readdirSync(categoryPath).filter(isCommandFile);

        for (const fileName of commandFiles) {
            const commandPathURL = pathToFileURL(join(categoryPath, fileName)).href;
            const { default: Command } = await import(commandPathURL);

            const command: BaseCommand = new Command(client);
            commands.push(command);
        }
    }

    client.logger.info(`Commands loaded: ${commands.length} commands registered`);
    return commands;
}