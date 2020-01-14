import { CommandoClient, Command, CommandoMessage } from 'discord.js-commando';
import { Message } from "discord.js";

export default class ClearCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            memberName: 'clear',
            group: 'general',
            name: 'clear',
            aliases: ['cls'],
            description: 'Clear messages.',
            details: `Clear messages`,
            examples: ['clear 10'],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            args: [
                {
                    key: 'numbers',
                    label: 'number',
                    prompt: 'What number of message would you like to delete?',
                    type: "integer|message",
                    min: 0,
                    max: 99
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: {numbers: number | CommandoMessage}): Promise<Message | Message[]> {
        // If the parameter is a message ID
        if (args.numbers instanceof CommandoMessage) {
            // Retrieve all messages that are more recent
            const messagesToDelete = await msg.channel.messages.fetch({after: args.numbers.id});
            // Add the message to the list so it's deleted too
            messagesToDelete.set(args.numbers.id, args.numbers.message);
            await msg.channel.bulkDelete(messagesToDelete);
        }
        // Otherwise delete the X last messages +1 because the user just wrote the command
        else await msg.channel.bulkDelete(args.numbers + 1);
        return msg.say("Messages deleted.");
    }
}
