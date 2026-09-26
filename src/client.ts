// Base
import { Client } from "discord.js";
import clientOptions from "#config/clientOptions.js";
//Types
import BaseCommand from "#structures/Command.js";
// Client
import loadCommands from "./utils/client/loadCommands.js";
import loadEvents from "./utils/client/loadEvents.js";
import Logger from "./utils/system/logger.js";
//Database
import connectDatabase from "./database/connection.js";

class BotClient extends Client {
    commands: BaseCommand[] = [];
    logger: Logger = new Logger()

    constructor() {
        super(clientOptions);
    }

    async init(): Promise<void> {
        this.commands = await loadCommands(this);
        await loadEvents(this);

        try {
            await connectDatabase(this.logger);
        } catch (err) {
            this.logger.error("Failed to connect to the database:", err);
            process.exit(1);
        }
    }
}

export default BotClient;