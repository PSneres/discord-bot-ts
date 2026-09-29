import { EmbedBuilder, EmbedData } from "discord.js";


export default class Embed extends EmbedBuilder {
    constructor(data: EmbedData) {
        super(data);

        if (data.footer?.text === " ") {
            this.setFooter({
                text: "\u200b",
                ...(data.footer?.iconURL && { iconURL: data.footer.iconURL }),
            });
        }

        this.setColor("#242429");
        this.setTimestamp();
    }
}