import Client from "#client";
import env from "#config/environment.js";

async function main(): Promise<void> {
    const client = new Client();

    await client.init();
    await client.login(env.discordToken);
}

main();