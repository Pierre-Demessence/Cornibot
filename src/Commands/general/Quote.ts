import { CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, TextChannel, Channel } from "discord.js";

import CorniCommand from "../../Engine/CorniCommand";
import Cornibot from "../../Engine/CorniBot";
import Logger from "../../Utils/Logger";

export default class QuoteCommand extends CorniCommand {
    constructor(client: Cornibot) {
        super(client, {
            memberName: "quote",
            group: "general",
            name: "quote",
            description: "Quote a message.",
            examples: ["quote 662065981660725288", "quote 662065981660725288 502516161741717524"],
            guildOnly: true,
            args: [
                {
                    key: "message",
                    label: "messageID",
                    prompt: "What message ID would you like to quote?",
                    type: "string",
                },
                {
                    key: "channel",
                    label: "channelID",
                    prompt: "Please give the channel ID of the message you want to quote.",
                    type: "text-channel",
                    default: (msg: CommandoMessage): Channel => msg.channel,
                },
            ],
        });
    }

    async run2(msg: CommandoMessage, args: { message: string; channel: TextChannel }): Promise<Message | Message[]> {
        try {
            const message = await args.channel.messages.fetch(args.message);
            return msg.say(
                new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", size: 128 }))
                    .setDescription(`${message.content}\n\n([Linkback](${message.url}))`)
                    .setTimestamp(message.createdTimestamp)
                    .setFooter(`Quoted by ${msg.author.tag} • From channel ${args.channel.name}`)
            );
        } catch (err) {
            Logger.error("Error:", err);
            return msg.reply("Message not found. If it comes from another channel please add the channel ID after the message ID.");
        }
    }
}
