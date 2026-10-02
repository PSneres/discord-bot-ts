import { User, Message } from "discord.js";

export default async function getUser(message: Message, targetId: string | undefined): Promise<User | null> {
    const mentionedUser = message.mentions.users.first();
    
    const fetchedMember = targetId && !mentionedUser
           ? await message.guild!.members.fetch(targetId).catch(() => null)
           : null;
    
    const selfUser = targetId ? null : message.author;
    const user = mentionedUser ?? fetchedMember?.user ?? selfUser;

    return user;
}