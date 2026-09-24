import Client from "../../client";
import BaseCommand from "../../structures/Command";
import { Message } from "discord.js";
import { guildRepository } from "../../database/repositories";
import { PermissionFlagsBits } from "discord.js";

export default class TestCommand extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "setprefix",
            description: "Configura meu prefixo no servidor.",
            usage: "<prefix>",
            memberPermissions: [ PermissionFlagsBits.ManageMessages ]
        });
    }

    async execute(message: Message, args: string[]) {
        if (!args[0]) {
            message.reply({
               content: `Prefixo invalido: por favor escreva um prefixo.`
            });
            return;
        }

        if (args[0].length > 5) {
            message.reply({
                content: `Prefixo invalido: o prefixo não pode ter mais que 5 caracteres.`
            });
            return;
        }
        
        await guildRepository.set(message.guild!.id, { prefix:  args[0] });

        message.reply({
            content: `Prefixo setado com sucesso! Novo prefixo: \`${args[0]}\``
        })
    }
}