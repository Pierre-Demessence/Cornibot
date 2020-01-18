import { CommandoClient } from "discord.js-commando";
import { Message } from "discord.js";

type ObserverInfo = {
    pattern: RegExp;
    matchCommands?: boolean;
    name: string;
};

export default abstract class Observer {
    private info: ObserverInfo;
    protected client: CommandoClient;

    constructor(client: CommandoClient, info: ObserverInfo) {
        this.client = client;
        this.info = info;
    }

    get pattern(): RegExp {
        return this.info.pattern;
    }

    get matchCommands(): boolean {
        return this.info.matchCommands || false;
    }

    get name(): string {
        return this.info.name;
    }

    public abstract Run(message: Message): void;
}
