import Client from "#client";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const EVENT_PATH = join(dirname(fileURLToPath(import.meta.url)), "../../events");

const isEventFile = (file: string) =>
    /\.(ts|js)$/.test(file) && !file.endsWith(".d.ts");

export default async function loadEvents(client: Client): Promise<void> {
    let eventCount = 0;

    for (const fileName of readdirSync(EVENT_PATH).filter(isEventFile)) {
        const filePathURL = pathToFileURL(join(EVENT_PATH, fileName)).href;
        const { default: Event } = await import(filePathURL);

        const event = new Event(client);
        const handler = async (...args: unknown[]) => {
            try {
                await event.execute(...args);
            } catch (error) {
                client.logger.error(`Event error in ${event.data.name}`, error);
            }
        };

        if (event.data.once) {
            client.once(event.data.name, handler);
        } else {
            client.on(event.data.name, handler);
        }

        eventCount++;
    }

    client.logger.info(`Events loaded: ${eventCount} events registered.`);
}