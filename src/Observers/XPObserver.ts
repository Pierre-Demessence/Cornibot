import Observer from "../Engine/Observer";
import { CommandoClient } from "discord.js-commando";
import { Message } from "discord.js";

import User from "../Models/User";

export default class XPObserver extends Observer {
    constructor(client: CommandoClient) {
        super(client, {
            name: "xp",
            pattern: /.*/,
            matchCommands: true
        });
    }

    public async Run(message: Message): Promise<void> {
        await User.updateOne(
            {
                discordID: message.author.id
            },
            {
                $inc: {
                    nbMessages: 1
                }
            },
            { upsert: true }
        );
    }
}
