# 🤖 discord-bot-ts

A multi-purpose Discord bot written in **TypeScript**, combining moderation tools, an experience (XP) system, a virtual economy, customizable server settings, and logging. Built to help with server administration and boost community engagement.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## ✨ Features

- 🛡️ **Moderation** – tools to keep your server organized and safe.
- ⭐ **XP system** – members earn experience by interacting and level up.
- 💰 **Virtual economy** – a custom in-bot currency to drive engagement.
- ⚙️ **Per-server settings** – each server can customize the bot's behavior.
- 📜 **Logging** – records important actions to make administration easier.

> 💡 Use `.help` to see the full list of available commands.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| [TypeScript](https://www.typescriptlang.org/) | Main language |
| [Node.js](https://nodejs.org/) (≥ 20) | Runtime |
| [discord.js v14](https://discord.js.org/) | Discord API integration |
| [Mongoose](https://mongoosejs.com/) | MongoDB ODM |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variables |
| [ms](https://github.com/vercel/ms) | Time conversion (e.g. `10m`, `2h`) |
| [tsx](https://github.com/privatenumber/tsx) | Running TypeScript in development |
| [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/) | Code linting |
| [Jest](https://jestjs.io/) + ts-jest | Testing |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) **20 or higher**
- A [MongoDB](https://www.mongodb.com/) database (local or [Atlas](https://www.mongodb.com/atlas))
- A bot application created in the [Discord Developer Portal](https://discord.com/developers/applications)

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/PSneres/discord-bot-ts.git

# 2. Enter the project folder
cd discord-bot-ts

# 3. Install dependencies
npm install
```

---

## 🔧 Configuration

1. Create a `.env` file in the project root.
2. Fill in the required variables:

```env
# Bot token (Discord Developer Portal > Bot)
DISCORD_TOKEN=your_token_here

# MongoDB connection string
MONGODB_URL=mongodb://localhost:27017/discord-bot
```

If any of the required environment variables is missing, the bot will warn you on startup.

> ⚠️ **Never** commit the `.env` file or your bot token to GitHub. The `.env` file should already be in `.gitignore`.

### Inviting the bot to your server

In the Developer Portal, go to **OAuth2 → URL Generator**, select the `bot` scope, choose the required permissions (e.g. *Manage Messages*, *Kick Members*, *Ban Members*), and use the generated URL to add the bot to your server.

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the bot in development mode with auto-reload (`tsx watch`) |
| `npm run build` | Compiles TypeScript into the `dist/` folder |
| `npm start` | Runs the compiled build (`dist/index.js`) |
| `npm run lint` | Runs ESLint |
| `npm test` | Runs the tests with Jest |

### Running in production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
discord-bot-ts/
├── src/
│   ├── commands/       # Prefix commands
│   ├── config/         # Bot configuration
│   ├── database/
│   │   ├── models/     # Mongoose schemas
│   │   └── repositories/   # Database access layer
│   ├── events/         # Discord event handlers
│   ├── services/       # Business logic
│   ├── structures/     # Base structures (commands, events, etc.)
│   ├── types/          # TypeScript types and interfaces
│   ├── utils/          # Helper functions
│   ├── client.ts       # Discord client instance
│   └── index.ts        # Entry point
├── .gitignore
├── LICENSE
├── package.json
└── tsconfig.json
```

> The structure above was inferred from the path aliases in `package.json` (`#config`, `#models`, `#repositories`, `#services`, `#structures`, `#client`). Adjust if needed.

---

## 📄 License

Distributed under the **MIT** license. See the [LICENSE](./LICENSE) file for more information.
