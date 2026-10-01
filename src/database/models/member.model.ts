import { Schema, model, InferSchemaType } from "mongoose";

const cooldownEntrySchema = new Schema(
  {
    name: { type: String, required: true },
    createdAt: { type: Number, required: true },
    expiresAt: { type: Number, required: true },
  },
  { _id: false }
);

const memberSchema = new Schema(
    {
        guildId: { type: String, required: true },
        userId: { type: String, required: true },
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        money: { type: Number, default: 0 },
        bank: { type: Number, default: 0 },
        cooldowns: { type: [cooldownEntrySchema], default: [] },
        active: { type: Boolean, default: true }
    },
    { timestamps: true }
)

export type Member = InferSchemaType<typeof memberSchema>;
export const MemberModel = model<Member>("member", memberSchema);