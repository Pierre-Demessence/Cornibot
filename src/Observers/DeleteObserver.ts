import { Message } from "discord.js";

import User from "../Models/User";
import DiscordBot from "../Engine/DiscordBot";
import MessageDeleteObserver from "../Engine/ObserverTypes/MessageDeleteObserver";

export default class XPObserver extends MessageDeleteObserver {
    constructor(client: DiscordBot) {
        super(client, {
            name: "log_deleted_message"
        });
    }

    public async Run(message: Message): Promise<void> {
        await User.updateOne({ _id: message.author.id }, { $inc: { nbMessages: 1 } }, { upsert: true });
    }
}
