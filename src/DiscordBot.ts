import * as Discord from "discord.js";

import { Readable } from "stream";

import ACommandManager from "./ACommandManager";
import PrefixCommandManager from "./CommandManagers/PrefixCommandManager";
import TTSCommandManager from "./CommandManagers/TTSCommandManager";
import * as TextToSpeechModule from "./Modules/TextToSpeechModule";

// tslint:disable-next-line: no-var-requires
const { token } = require("./../config.json");

export default class DiscordBot {
    private client: Discord.Client;
    private commandManager: ACommandManager;

    constructor() {
        this.client = new Discord.Client();
        this.commandManager = new TTSCommandManager(this.client);
    }

    public Start() {
        this.Init();
        this.Login(token);
    }

    private Init() {
        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);
        });

        const stdin = process.openStdin();
        stdin.addListener("data", async (d) => {
            const connection = this.client.voice?.connections.first();
            if (!connection) return;
            const audio = await TextToSpeechModule.TTS(d.toString().trim());
            connection.play("output.mp3", {
                bitrate: 32000,
            });
        });

        this.client.on("message", async (message) => {
            if (message.author?.bot) return;
            this.commandManager.Parse(message);
        });
    }

    private Login(tok: string) {
        this.client.login(tok);
    }
}
