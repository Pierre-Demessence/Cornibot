import { CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";
import moment from "moment";

import CorniCommand from "../../Engine/CorniCommand";
import DiscordBot from "../../Engine/DiscordBot";
import Mute from "../../Models/Mute";

export default class MutesCommand extends CorniCommand {
    constructor(client: DiscordBot) {
        super(client, {
            memberName: "mutes",
            group: "moderation",
            name: "mutes",
            aliases: [],
            description: "Get informations about mutes.",
            examples: ["mutes", "mutes Crawl@1234"],
            userPermissions: ["MUTE_MEMBERS"],
            guildOnly: true,
            args: [
                {
                    key: "member",
                    label: "member",
                    prompt: "What user would you like to snoop on?",
                    type: "member",
                    default: ""
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: { member: GuildMember | null }): Promise<Message | Message[]> {
        if (!args.member) {
            const mutes = await Mute.find({ dateEnd: { $gt: new Date() } });
            if (mutes.length === 0) return msg.reply("no ongoing mute.");
            let res = `**list of ongoing mutes:**\n`;
            for (const mute of mutes) {
                const user = await this.client.users.fetch(mute.user);
                const author = await this.client.users.fetch(mute.author);
                const remainingTime = moment(mute.dateEnd).diff(moment(), "seconds");
                res += `• ${user.tag} ${remainingTime}s remaining (by ${author.tag}) - Reason: ${mute.reason}\n`;
            }
            return msg.reply(res);
        }
        const mutes = await Mute.find({ user: args.member.id });
        if (mutes.length === 0) return msg.reply(`${args.member.user.tag} has received no mute.`);
        let res = `**list of mutes ${args.member.user.tag} has received:**\n`;
        for (const mute of mutes) {
            const author = await this.client.users.fetch(mute.author);
            const date = moment(mute.createdAt);
            const duration = moment(mute.dateEnd).diff(date, "seconds");
            res += `• [${date.fromNow()}]\t${duration}s\t(by ${author.tag}) - Reason: ${mute.reason}\n`;
        }
        return msg.reply(res);
    }
}
