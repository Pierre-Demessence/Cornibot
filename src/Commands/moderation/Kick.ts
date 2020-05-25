import { CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";

import CorniCommand from "../../Engine/CorniCommand";
import Cornibot from "../../Engine/CorniBot";

export default class UserInfoCommand extends CorniCommand {
    constructor(client: Cornibot) {
        super(client, {
            memberName: "kick",
            group: "general",
            name: "kick",
            aliases: [],
            description: "Kick a user.",
            examples: ["kick @Foo#0123", "kick Foo"],
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
            guildOnly: true,
            args: [
                {
                    key: "member",
                    label: "user",
                    prompt: "What user would you like to kick?",
                    type: "member",
                },
                {
                    key: "reason",
                    label: "reason",
                    prompt: "What reason?",
                    type: "string",
                    default: "",
                },
            ],
        });
    }

    async run2(msg: CommandoMessage, args: { member: GuildMember; reason: string }): Promise<Message | Message[]> {
        await args.member.kick(args.reason);
        return msg.say(`${args.member} was kicked.`);
    }
}
