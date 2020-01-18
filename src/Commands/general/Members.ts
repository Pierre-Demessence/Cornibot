import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

const oneLine = require("common-tags").oneLine;

export default class AddNumbersCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "members",
            group: "general",
            memberName: "members",
            description: "Choose randomly an item in the list.",
            details: oneLine`
				Choose an item randomly in a list of options given by the user.
			`,
            examples: ["choose pizza burger pasta"]
        });
    }

    async run(msg: CommandoMessage, _args: { options: string[] }): Promise<Message | Message[]> {
        return msg.reply([`there are ${msg.guild.memberCount} members on this server!`]);
    }
}
