import { Message } from "discord.js";

import Config from "../Engine/Config";
import MessageObserver from "../Engine/ObserverTypes/MessageObserver";
import User from "../Models/User";
import Cornibot from "../Engine/CorniBot";

export default class KarmaObserver extends MessageObserver {
    constructor(client: Cornibot) {
        super(client, {
            name: "karma",
            pattern: new RegExp(Config.thanksWords.join("|"), "i"),
        });
    }

    public async Run(message: Message): Promise<void> {
        const receivers = message.mentions.users.filter((user) => {
            return !user.bot && message.author.id !== user.id;
        });
        if (receivers.size === 0) return;

        await User.updateOne({ _id: message.author.id }, { $inc: { karmaGiven: receivers.size } }, { upsert: true });
        receivers.forEach(async (u) => await User.updateOne({ _id: u.id }, { $inc: { karmaReceived: 1 } }, { upsert: true }));

        await message.channel.send(
            `**${message.author.username}** gave karma to **${receivers
                .array()
                .map((u) => u.username)
                .join(", ")}**.`
        );
    }
}
