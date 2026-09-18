import dotenv from "dotenv";

dotenv.config({
    quiet: true
})

export default class Environment {
    static get discordToken() {
        const token = process.env.DISCORD_TOKEN;

        if (!token) {
            console.log(token)
            throw new Error("DISCORD_TOKEN, not defined in .env");
        }

        return token;
    }
}