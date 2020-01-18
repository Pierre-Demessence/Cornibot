import Observer from "../Engine/Observer";
import { CommandoClient } from "discord.js-commando";
import { Message } from "discord.js";

import { thanksWords } from "../Engine/Config";

export default class KarmaObserver extends Observer {
    constructor(client: CommandoClient) {
        super(client, {
            name: "karma",
            pattern: new RegExp(thanksWords.join("|"))
        });
    }

    public Run(message: Message): void {
        const receivers = message.mentions.users.filter(user => {
            return !user.bot && message.author.id !== user.id;
        });
        if (receivers.size === 0) return;
        message.channel.send(
            `**${message.author.username}** gave karma to **${receivers
                .array()
                .map(u => u.username)
                .join(", ")}**.`
        );
    }
}
