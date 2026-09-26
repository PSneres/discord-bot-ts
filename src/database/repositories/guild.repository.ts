import { GuildModel, Guild } from "#models/guild.model.js";

type GuildUpdate = Partial<Omit<Guild, "_id">>;

class GuildRepository {
    private cache = new Map<string, Guild>();

    async get(id: string): Promise<Guild> {
        const cached: Guild | undefined = this.cache.get(id);
        if (cached) return cached;

        const guild: Guild = (await GuildModel.findById(id).lean()) ?? (await this.set(id, {}))
        this.cache.set(id, guild);

        return guild;
    }

    async set(id: string, value: GuildUpdate): Promise<Guild> {
        const guild = await GuildModel.findByIdAndUpdate(id, value, 
        { 
            upsert: true,
            returnDocument: "after"
        }).lean();

        this.cache.set(id, guild);

        return guild;
    }

    async delete(id: string): Promise<void> {
        await GuildModel.findByIdAndDelete(id);
        this.cache.delete(id);

        return;
    }
}

export const guildRepository = new GuildRepository();