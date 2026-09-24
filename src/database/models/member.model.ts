import { Schema, model, InferSchemaType } from "mongoose";

const memberSchema = new Schema(
    {
        guildId: { type: String, required: true },
        userId: { type: String, required: true },
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        money: { type: Number, default: 0 },
        bank: { type: Number, default: 0 },
    },
    { timestamps: true }
)

export type Member = InferSchemaType<typeof memberSchema>;
export const MemberModel = model("guild", memberSchema);