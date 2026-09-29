import { Schema, model, InferSchemaType } from "mongoose";
import { config } from "#config/constants.js";

const guildSchema = new Schema(
    {
        _id: { type: String, required: true },
        prefix: { type: String, default: config.prefix  },
        xpChannel: { type: String, required: false }
    },
    { timestamps: true }
)

export type Guild = InferSchemaType<typeof guildSchema>;
export const GuildModel = model<Guild>("guild", guildSchema);