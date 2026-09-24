import dotenv from "dotenv";

dotenv.config({
    quiet: true
})

export default class Environment {
    static get discordToken() {
        const token = process.env.DISCORD_TOKEN;

        if (!token) {
            throw new Error("DISCORD_TOKEN, is not defined in .env");
        }

        return token;
    }
    static get mongoUrl() {
        const key = process.env.MONGODB_URL;

        if (!key)  {
            throw new Error("MONGODB_URL, is not defined in .env")
        }

        return key;
    }
}