import Client from "./client";
import env from "./config/environment";

async function main(): Promise<void> {
    const client = new Client();

    await client.init();
    await client.login(env.discordToken);

}

main();