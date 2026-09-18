import Client from "../client";
import BaseEvent from "../structures/Event";

export default class Ready extends BaseEvent<"clientReady"> {
    constructor(client: Client) {
       super(client, {
            name: "clientReady",
            once: true
       }) 
    }

    async execute() {
        this.client.logger.info(`Client started in ${this.client.user?.username}.`);
    }
}