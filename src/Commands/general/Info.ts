import { CommandoMessage } from "discord.js-commando";
import { Message, GuildMember, MessageEmbed } from "discord.js";

import CorniCommand from "../../Engine/CorniCommand";
import DiscordBot from "../../Engine/DiscordBot";
import User from "../../Models/User";
import moment = require("moment");

export default class ProfileCommand extends CorniCommand {
    constructor(client: DiscordBot) {
        super(client, {
            name: "info",
            group: "general",
            memberName: "info",
            description: "Gets information about a user.",
            examples: ["info @Crawl#3208", "info Crawl"],
            guildOnly: true,
            args: [
                {
                    key: "member",
                    label: "user",
                    prompt: "What user would you like to snoop on?",
                    type: "member",
                    default: (msg: CommandoMessage): GuildMember => msg.member
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: { member: GuildMember }): Promise<Message | Message[]> {
        const user = await User.findOne({ _id: args.member.id });
        if (!user) throw new Error("User does not exist.");

        return msg.say(
            new MessageEmbed()
                .setColor(args.member.displayHexColor)
                .setAuthor(args.member.user.tag, args.member.user.displayAvatarURL({ format: "png", size: 128 }))
                .setTitle(args.member.displayName)
                .setDescription(
                    args.member.roles
                        .filter(r => r !== msg.guild.roles.everyone)
                        .array()
                        .map(r => r.name)
                        .join(" | ")
                )
                .addField("Joined at", moment(args.member.joinedAt || undefined).toLocaleString())
                .addField("Created at", moment(args.member.user.createdAt || undefined).toLocaleString())
                .addBlankField()
                .addField("Karma", user.get("karmaReceived"), true)
                .addField("Karma Given", user.get("karmaGiven"), true)
                .setTimestamp()
                .setFooter(msg.guild.name, msg.guild.iconURL({ format: "png", size: 64 }) || "")
        );
    }
}
