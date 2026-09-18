import Client from "../../client";
import { readdirSync } from "fs";
import { pathToFileURL } from "node:url";

export default async function loadEvents(client: Client): Promise<void> {
    const EVENT_PATH = "./src/Events";

    let eventCount = 0;
    for (let fileName of readdirSync(EVENT_PATH)) {
        const filePathURL = pathToFileURL(`${EVENT_PATH}/${fileName}`).href
        const { default: Event }  = await import(filePathURL);
                
        const event = new Event(client);
        if (event.data.once) {
            client.once(event.data.name, (...args) => event.execute(...args));
        } else {
            client.on(event.data.name, (...args) => event.execute(...args));
        }

        eventCount++
    }
    client.logger.info(`Events loaded: ${eventCount} events registered.`)
}