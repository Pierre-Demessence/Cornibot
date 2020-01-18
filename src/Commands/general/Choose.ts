import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

const oneLine = require("common-tags").oneLine;
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export default class AddNumbersCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "choose",
            group: "general",
            memberName: "choose",
            description: "Choose randomly an item in the list.",
            details: oneLine`
				Choose an item randomly in a list of options given by the user.
			`,
            examples: ["choose pizza burger pasta"],
            args: [
                {
                    key: "options",
                    label: "options",
                    prompt: "What options would you like to add? Every message you send will be interpreted as a single option.",
                    type: "string",
                    infinite: true
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: { options: string[] }): Promise<Message | Message[]> {
        const choice = args.options[randomInt(0, args.options.length - 1)];
        return msg.reply(`${choice}`);
    }
}
