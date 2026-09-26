import { config } from "#config/constants.js";
import { guildRepository } from "#repositories";

export default async function getPrefix(guildId: string): Promise<string> {
    const guildData = await guildRepository.get(guildId);
    const prefix: string = guildData.prefix ?? config.prefix;

    return prefix;
}