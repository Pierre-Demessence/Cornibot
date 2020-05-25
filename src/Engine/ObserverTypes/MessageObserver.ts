import { Message } from "discord.js";

import Observer, { ObserverInfo } from "../Observer";
import Cornibot from "../CorniBot";

type MessageObserverInfo = ObserverInfo & {
    matchCommands?: boolean;
    pattern: RegExp;
};

export default abstract class MessageObserver extends Observer<Message> {
    protected info: MessageObserverInfo;

    constructor(client: Cornibot, info: MessageObserverInfo) {
        super(client, info);
        this.client = client;
        this.info = info;
    }

    get event(): string {
        return "message";
    }

    get matchCommands(): boolean {
        return this.info.matchCommands || false;
    }

    get pattern(): RegExp {
        return this.info.pattern;
    }

    public Check(message: Message): boolean {
        if (message.author.bot) return false;
        if (!this.matchCommands && message.content.startsWith(this.client.commandPrefix)) return false;
        if (!this.pattern.test(message.content)) return false;
        return true;
    }
}
