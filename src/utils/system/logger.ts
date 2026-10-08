import "colors";
import { Guild } from "discord.js";
import { guildRepository } from "#repositories";
import Embed from "#structures/Embed";

interface LogEvents {
  ban:           { moderatorId: string; targetId: string; reason: string };
  kick:          { moderatorId: string; targetId: string; reason: string };
  warn:          { moderatorId: string, targetId: string, reason: string };
  timeout:       { moderatorId: string; targetId: string; reason: string };
  unwarn:        { moderatorId: string, targetId: string, warnId: number };
  messageEdit:   { authorId: string; messageUrl: string; before: string; after: string };
  messageDelete: { authorId: string; content: string };
}

type LogEventType = keyof LogEvents;
type ModerationEventType = Extract<LogEventType, "ban" | "kick" | "timeout" | "warn">;

async function moderationEmbed<K extends ModerationEventType>(guild: Guild, title: string, { moderatorId, targetId, reason }: LogEvents[K]): Promise<Embed | null> {
     const [moderator, target] = await Promise.all([
        guild.members.fetch(moderatorId).catch(() => null),
        guild.members.fetch(targetId).catch(() => null),
    ]);

    if (!moderator || !target) return null;

    const embed = new Embed({
        author: {
            name: title,
            iconURL: moderator.user.displayAvatarURL()
        },
        description: `Membro: ${target.user.username} (${target.id})\nModerador ${moderator.user.username} (${moderator.id})\nMoitvo: ${reason}`
    });

    return embed;
}

type Formatter<K extends LogEventType> = (guild: Guild, data: LogEvents[K]) => Promise<Embed | null>;
const formatters: { [K in LogEventType]: Formatter<K> } = {
    ban: async (guild, data) => moderationEmbed<"ban">(guild, "Membro banid.o", data),
    kick: async (guild, data) => moderationEmbed<"kick">(guild, "Membro expulso.", data),
    timeout: async (guild, data) => moderationEmbed<"timeout">(guild, "Membro Mutado.", data),
    warn: async (guild, data) => moderationEmbed<"warn">(guild, "Membro recebeu um warn.", data),
    unwarn: async (guild, data) => {
        const [moderator, target] = await Promise.all([
            guild.members.fetch(data.moderatorId).catch(() => null),
            guild.members.fetch(data.targetId).catch(() => null),
        ]);

        if (!moderator || !target) return null;

        const embed = new Embed({
            author: {
                name: "Warn removido",
                iconURL: moderator.user.displayAvatarURL()
            },
            description: `Membro: ${target.user.username} (${target.id})\nModerador ${moderator.user.username} (${moderator.id})\nWarn: ${data.warnId}`
        });

        return embed;
    },
    messageEdit: async(guild, data) => {
        const author = await guild.members.fetch(data.authorId).catch(() => null);
        if (!author) return null;
        // before can be null/undefined when the message was sent before the bot
        // started (not cached), so there is no old content to compare against
        if (!data.before) return null;

        const embed = new Embed({
            title: "Mensagem editada",
            author: {
                name: `${author.user.tag}`,
                iconURL: author.user.displayAvatarURL()
            },
            url: data.messageUrl,
            fields: [
                { name: "Antes", value: `\`\`\`${data.before.slice(0, 1024) || "—"}\`\`\``, inline: false },
                { name: "Depois", value: `\`\`\`${data.after.slice(0, 1024) || "—"}\`\`\``, inline: false },
            ]
        });

        return embed;
    },
    messageDelete: async(guild, data) => {
        const author = await guild.members.fetch(data.authorId).catch(() => null);
        if (!author) return null;

        const embed = new Embed({
            author: {
                name: `Mensagem apagada`,
                iconURL: author.user.displayAvatarURL()
            },
            description: `\`\`\`${data.content.slice(0, 4000)}\`\`\``
        });

        return embed;
    },
}

class Logger {
    info(message: string): void {
        console.log("[INFO]".cyan, message);
    }

    warn(message: string): void {
        console.log("[WARN]".yellow, message);
    }

    error(message: string, error?: unknown): void {
        console.error("[ERROR]".red, message);

        if (error instanceof Error) {
            console.error(error.stack);
        }
    }
    
    async send<K extends LogEventType>(guild: Guild, type: K, data: LogEvents[K]) {
        const guildData = await guildRepository.get(guild.id);
        if (!guildData.logChannel) return;

        const channel = await guild.channels.fetch(guildData.logChannel).catch(() => null);
        if (!channel || !channel.isTextBased()) {
            await guildRepository.set(guild.id, { logChannel: null});
            return;
        }

        const embed = await formatters[type](guild, data);
        if (!embed) {
            this.error("Logger send error:", 
                new Error( `Logger: could not build "${type}" log in ${guild.id}. ` +
                          `Possible causes: invalid author/moderator/target ID, or missing message content ` +
                          `(before may be undefined if the message was sent before the bot started).`
                ))
            return;
        };

        await channel.send({
            embeds: [embed]
        });
    }  
}

export default Logger;