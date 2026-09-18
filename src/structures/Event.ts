import { ClientEvents } from "discord.js";
import Client from "../client";

export interface EventData<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
}

export default abstract class BaseEvent<K extends keyof ClientEvents = keyof ClientEvents> {
    constructor(
        public readonly client: Client,
        public readonly data: EventData<K>
    ) {}

    abstract execute(...args: ClientEvents[K]): Promise<void>;
}