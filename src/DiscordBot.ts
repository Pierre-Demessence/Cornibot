import * as Discord from "discord.js";

import ACommandManager from "./ACommandManager";
import CommandManager from "./CommandManagers/PrefixCommandManager";
import Logger from "./Logger";
import { token } from "./Config";

export default class DiscordBot {
    private client: Discord.Client;
    private commandManager: ACommandManager;

    constructor() {
        this.client = new Discord.Client();
        this.commandManager = new CommandManager(this.client);
    }

    public Start(): void {
        this.Init();
        this.Login(token);
    }

    private Init(): void {
        this.client.on("ready", () => {
            Logger.info(`Logged in as ${this.client.user?.tag}`);
        });

        this.client.on("message", async (message) => {
            if (message.author?.bot) return;
            this.commandManager.Parse(message);
        });
    }

    private Login(tok: string): void {
        this.client.login(tok);
    }
}
