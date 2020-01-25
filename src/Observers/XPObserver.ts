import { Message } from "discord.js";

import User from "../Models/User";
import MessageObserver from "../Engine/ObserverTypes/MessageObserver";
import DiscordBot from "../Engine/DiscordBot";

export default class XPObserver extends MessageObserver {
    constructor(client: DiscordBot) {
        super(client, {
            name: "xp",
            pattern: /.*/,
            matchCommands: true
        });
    }

    public async Run(message: Message): Promise<void> {
        await User.updateOne({ _id: message.author.id }, { $inc: { nbMessages: 1 } }, { upsert: true });
    }
}
