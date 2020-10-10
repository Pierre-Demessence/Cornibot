import { CommandoMessage } from "discord.js-commando";
import { Message, TextChannel } from "discord.js";

import CorniCommand from "../../Engine/CorniCommand";
import Cornibot from "../../Engine/CorniBot";

export default class ClearCommand extends CorniCommand {
    constructor(client: Cornibot) {
        super(client, {
            memberName: "clear",
            group: "moderation",
            name: "clear",
            aliases: ["cls"],
            description: "Clear messages.",
            examples: ["clear 10", "clear 662065981660725288"],
            clientPermissions: ["MANAGE_MESSAGES"],
            userPermissions: ["MANAGE_MESSAGES"],
            guildOnly: true,
            args: [
                {
                    key: "numbers",
                    label: "number",
                    prompt: "What number of message would you like to delete?",
                    type: "integer|message",
                    min: 0,
                    max: 99,
                },
            ],
        });
    }

    async run2(msg: CommandoMessage, args: { numbers: number | CommandoMessage }): Promise<Message | Message[]> {
        // If the parameter is a message ID
        if (args.numbers instanceof CommandoMessage) {
            // Retrieve all messages that are more recent
            const messagesToDelete = await msg.channel.messages.fetch({ after: args.numbers.id });
            // Add the message to the list so it's deleted too
            messagesToDelete.set(args.numbers.id, args.numbers.message);
            await (msg.channel as TextChannel).bulkDelete(messagesToDelete);
        }
        // Otherwise delete the X last messages +1 because the user just wrote the command
        else await (msg.channel as TextChannel).bulkDelete(args.numbers + 1);
        return msg.say("Messages deleted.");
    }
}
