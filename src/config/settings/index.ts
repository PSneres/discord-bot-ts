import type { Config, ConfigAction } from "../../types/Config.js";
import {  Message } from "discord.js";
import { readdirSync } from "fs";

const configs = new Map<string, Config>();
const loadedConfigs: Config[] = []

const extRegex = /\.(ts|js)$/;
const isConfigFile = (f: string) => extRegex.test(f) && !f.endsWith(".d.ts");

const files = readdirSync("./src/config/settings").filter(isConfigFile);

for (const file of files) {
  if (file === "index.ts" || file === "index.js") continue;

   const { default: mod } = await import(`./${file}`) as { default: Config };
  configs.set(mod.name, mod);
  loadedConfigs.push(mod);

  if (!mod.aliases || mod.aliases.length <= 0) continue;

  for (let i of mod.aliases) {
    configs.set(i, mod);
  }
}

export { loadedConfigs }

export async function executeConfig(message: Message, args: string[]): Promise<void> {
    const [action, name, value] = args;

    if (!isValidAction(action) || !name) {
        await message.reply({ 
            content: "Argumentos invalidos. Use: \`config <set|remove> <nome> [valor]\`"
         });
        return;
    }

    const config: Config | undefined = configs.get(name.toLowerCase());
    if (!config) {
        await message.reply({ 
            content: "Config inexistente. Digite o comando \`config\` para poder ver todos as configs disponiveis."
         });
        return;
    }

    if (action === "set") {
        if (!config.set || !value) {
            await message.reply({ 
                content: "Essa config não aceita set, ou faltou o valor."
             });
            return;
        }
        
        await config.set(message, value); 
        return;
    }

    if (!config.remove) {
        await message.reply({ 
            content: "Essa config não pode ser removida."
        });
        return;
    }
    await config.remove(message);
}

const actions: Record<ConfigAction, true> = { set: true, remove: true };

function isValidAction(action: string | undefined): action is ConfigAction {
  return !!action && Object.hasOwn(actions, action);
}