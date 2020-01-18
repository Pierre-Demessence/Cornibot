import Observer from "../Engine/Observer";
import { CommandoClient } from "discord.js-commando";
import { Message } from "discord.js";

import { thanksWords } from "../Engine/Config";
import User from "../Models/User";

export default class KarmaObserver extends Observer {
    constructor(client: CommandoClient) {
        super(client, {
            name: "karma",
            pattern: new RegExp(thanksWords.join("|"))
        });
    }

    public async Run(message: Message): Promise<void> {
        const receivers = message.mentions.users.filter(user => {
            return !user.bot && message.author.id !== user.id;
        });
        if (receivers.size === 0) return;

        await User.updateOne({ discordID: message.author.id }, { $inc: { karmaGiven: receivers.size } }, { upsert: true });
        receivers.forEach(async u => await User.updateOne({ discordID: u.id }, { $inc: { karmaReceived: 1 } }, { upsert: true }));

        await message.channel.send(
            `**${message.author.username}** gave karma to **${receivers
                .array()
                .map(u => u.username)
                .join(", ")}**.`
        );
    }
}
