import { CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";

import CorniCommand from "../../Engine/CorniCommand";
import DiscordBot from "../../Engine/DiscordBot";

export default class UserInfoCommand extends CorniCommand {
    constructor(client: DiscordBot) {
        super(client, {
            memberName: "kick",
            group: "general",
            name: "kick",
            aliases: [],
            description: "Kick a user.",
            examples: ["kick @Crawl#3208", "kick Crawl"],
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
            guildOnly: true,
            args: [
                {
                    key: "member",
                    label: "user",
                    prompt: "What user would you like to snoop on?",
                    type: "member"
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: { member: GuildMember }): Promise<Message | Message[]> {
        // await args.member.kick();
        return msg.say(`${args.member} was kicked.`);
    }
}
