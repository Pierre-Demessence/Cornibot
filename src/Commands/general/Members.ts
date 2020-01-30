import { CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

import CorniCommand from "../../Engine/CorniCommand";
import DiscordBot from "../../Engine/DiscordBot";

export default class AddNumbersCommand extends CorniCommand {
    constructor(client: DiscordBot) {
        super(client, {
            name: "members",
            group: "general",
            memberName: "members",
            description: "Get the number of members in the server.",
            examples: ["members"]
        });
    }

    async run(msg: CommandoMessage, _args: { options: string[] }): Promise<Message | Message[]> {
        return msg.reply([`there are ${msg.guild.memberCount} members on this server!`]);
    }
}
