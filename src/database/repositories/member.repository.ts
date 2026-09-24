import { MemberModel, Member } from "../models/member.model";

type MemberUpdate = Partial<Omit<Member, "guildId" | "userId">>;

class MemberRepository {
    async get(guildId: string, userId: string): Promise<Member> {
        const member = (await MemberModel.findOne({ guildId, userId }).lean()) ?? (await this.set(guildId, userId, {}))

        return member;
    }

    async set(guildId: string, userId: string, value: MemberUpdate): Promise<Member> {
        const member = MemberModel.findOneAndUpdate({ guildId, userId }, value, 
        {
            upsert: true,
            new: true
        }).lean();

        return member;
    }

    async delete(guildId: string, userId: string): Promise<void> {
        await MemberModel.findOneAndDelete({ guildId, userId });

        return;
    }

    async deleteGuild(guildId: string) {
        await MemberModel.deleteMany({ guildId });
    }

    async top(guildId: string, limit = 10): Promise<Member[]> {
        return await MemberModel.find({ guildId }).sort({ xp: -1 }).limit(limit).lean();
    }
}

export const memberRepository = new MemberRepository();