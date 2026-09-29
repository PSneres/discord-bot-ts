import type { Message } from "discord.js"; 

export type ConfigActions = {
  set?: (message: Message, value: string) => Promise<void>;
  remove?: (message: Message) => Promise<void>;
};

export type Config = ConfigActions & {
  name: string;
  description: string,
  value?: string,
  aliases?: string[]
};

export type ConfigAction = keyof ConfigActions;
