// Base
import { Client } from "discord.js";
import clientOptions from "./config/clientOptions";
//Types
import BaseCommand from "./structures/Command";
// Client
import loadCommands from "./utils/client/loadCommands";
import loadEvents from "./utils/client/loadEvents";
import Logger from "./utils/system/logger";

class BotClient extends Client {
    commands: BaseCommand[] = [];
    logger: Logger = new Logger()

    constructor() {
        super(clientOptions);
    }

    async init(): Promise<void> {
        this.commands = await loadCommands(this);
        await loadEvents(this);
    }
}

export default BotClient;