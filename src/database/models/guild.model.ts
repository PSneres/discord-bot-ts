import { Schema, model, InferSchemaType } from "mongoose";
import { config } from "../../config/constants";

const guildSchema = new Schema(
    {
        _id: { type: String, required: true },
        prefix: { type: String, required: true, default: config.prefix  }
    },
    { timestamps: true }
)

export type Guild = InferSchemaType<typeof guildSchema>;
export const GuildModel = model("guild", guildSchema);