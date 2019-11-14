import * as Discord from "discord.js";

import CommandLoader from "./CommandLoader";

export default abstract class ACommandManager {
    protected commandLoader = new CommandLoader();
    protected client: Discord.Client;

    constructor(client: Discord.Client) {
        this.client = client;
    }

    public abstract Parse(message: Discord.Message | Discord.PartialMessage): void;
}
