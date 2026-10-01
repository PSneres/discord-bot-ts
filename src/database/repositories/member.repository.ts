import { MemberModel, Member } from "#models/member.model.js";
import Cooldown from "../../types/Cooldown.js"

type MemberUpdate = Partial<Omit<Member, "guildId" | "userId">>;


class MemberRepository {
    private cache = new Map<string, Cooldown>();

    async get(guildId: string, userId: string): Promise<Member> {
        const member = (await MemberModel.findOne({ guildId, userId }).lean()) ?? (await this.set(guildId, userId, {}))

        return member;
    }

    async set(guildId: string, userId: string, value: MemberUpdate): Promise<Member> {
        const member = MemberModel.findOneAndUpdate({ guildId, userId }, value, 
        {
            upsert: true,
            returnDocument: "after"
        }).lean();

        return member;
    }

    async delete(guildId: string, userId: string): Promise<void> {
        await MemberModel.findOneAndDelete({ guildId, userId });

        return;
    }

    async deleteGuild(guildId: string): Promise<void> {
        await MemberModel.deleteMany({ guildId });
    }

    async setGuild(guildId: string, value: MemberUpdate): Promise<void> {
        if (Object.keys(value).length === 0)  {
            throw new Error("setGuild: no fields provided to update.");
        }

        await MemberModel.updateMany(
            { guildId },
            { $set: value }
        );
    }

    // XP functions

   async topXP(guildId: string, page = 1, pageSize = 10) {
        const [members, total] = await Promise.all([
            MemberModel.find({ guildId })
                .sort({ xp: -1, _id: 1 }) 
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean()
                .maxTimeMS(3000),
            MemberModel.countDocuments({ guildId }),
        ]);

        return { members, total, totalPages: Math.ceil(total / pageSize) };
    }

    async getRank(guildId: string, userId: string) {
        const member = await MemberModel.findOne({ guildId, userId }).lean();
        if (!member) return null;

        const higher = await MemberModel.countDocuments({
            guildId,
            $or: [
                { xp: { $gt: member.xp } },
                { xp: member.xp, _id: { $lt: member._id } },
            ],
        });

        return { member, position: higher + 1 };
    }

    // Coldown functions

    async getCooldown(guildId: string, userId: string, key: string): Promise<Cooldown> {
        const cached = this.cache.get(`${guildId}/${userId}/${key}`);
        if (cached) return cached;

        const memberData: Member = await this.get(guildId, userId);
        const cooldowns: Cooldown[] = memberData.cooldowns;

        const cooldown: Cooldown | undefined = cooldowns.find(({ name }) => name === key);
        if (!cooldown) return { name: key, expiresAt: 0, createdAt: 0 }

        this.cache.set(`${guildId}/${userId}/${key}`, cooldown);

        return cooldown;
    }

    async setCooldown(guildId: string, userId: string, key: string, cooldown: Cooldown): Promise<Cooldown> {
        const memberData: Member = await this.get(guildId, userId);
        const cooldowns: Cooldown[] = memberData.cooldowns;
        const foundIndex: number = cooldowns.findIndex(({ name }) => name === key);
        const index: number = foundIndex === -1 ? cooldowns.length : foundIndex;

        cooldowns[index] = cooldown

        await this.set(guildId, userId, memberData);
        this.cache.set(`${guildId}/${userId}/${key}`, cooldown);

        return cooldown;
    }
}

export const memberRepository = new MemberRepository();