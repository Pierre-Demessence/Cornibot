import { CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";

import Mute from "../../Models/Mute";
import UnmuteService from "../../Services/UnmuteService";
import DiscordBot from "../../Engine/DiscordBot";
import CorniCommand from "../../Engine/CorniCommand";

export default class UnmuteCommand extends CorniCommand {
    constructor(client: DiscordBot) {
        super(client, {
            memberName: "unmute",
            group: "moderation",
            name: "unmute",
            aliases: [],
            description: "Unmute a user.",
            examples: ["unmute @Foo#0123"],
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MUTE_MEMBERS"],
            guildOnly: true,
            args: [
                {
                    key: "member",
                    label: "user",
                    prompt: "What user would you like to unmute?",
                    type: "member"
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: { member: GuildMember }): Promise<Message | Message[] | null> {
        const mute = await Mute.findOne({
            user: args.member.id,
            dateEnd: {
                $gt: new Date()
            }
        });
        if (!mute) return msg.reply(`${args.member.user.tag} is not currently muted.`);
        await this.client.GetService(UnmuteService)?.Unmute(mute);
        return null;
    }
}
