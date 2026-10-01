import Client from "#client";
import { readdirSync } from "fs";
import { pathToFileURL } from "node:url";

export default async function loadEvents(client: Client): Promise<void> {
    const EVENT_PATH = "./src/Events";

    let eventCount = 0;
    for (const fileName of readdirSync(EVENT_PATH)) {
        const filePathURL = pathToFileURL(`${EVENT_PATH}/${fileName}`).href
        const { default: Event }  = await import(filePathURL);
                
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
            }
            else {
                client.on(event.data.name, handler);
            }

        eventCount++
    }
    client.logger.info(`Events loaded: ${eventCount} events registered.`)
}