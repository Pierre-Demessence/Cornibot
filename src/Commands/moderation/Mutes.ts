import { CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";
import moment from "moment";

import CorniCommand from "../../Engine/CorniCommand";
import Cornibot from "../../Engine/CorniBot";
import Mute from "../../Models/Mute";

export default class MutesCommand extends CorniCommand {
    constructor(client: Cornibot) {
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
                    default: "",
                },
            ],
        });
    }

    private async showOngoingMutes(msg: CommandoMessage): Promise<Message | Message[]> {
        const mutes = await Mute.find({ dateEnd: { $gt: new Date() } });
        if (mutes.length === 0) return msg.reply("no ongoing mute.");
        let res = `**list of ongoing mutes:**\n`;
        for (const mute of mutes) {
            const user = await this.client.users.fetch(mute.user);
            const author = await this.client.users.fetch(mute.author);
            const remainingTime = Math.ceil(moment(mute.dateEnd).diff(moment(), "seconds", true));
            res += `• ${user.tag} ${remainingTime}s remaining (by ${author.tag}) - Reason: ${mute.reason}\n`;
        }
        return msg.reply(res);
    }

    private async showMutes(msg: CommandoMessage, member: GuildMember): Promise<Message | Message[]> {
        const mutes = await Mute.find({ user: member.id });
        if (mutes.length === 0) return msg.reply(`${member.user.tag} has received no mute.`);
        let res = `**list of mutes ${member.user.tag} has received:**\n`;
        for (const mute of mutes) {
            const author = await this.client.users.fetch(mute.author);
            const date = moment(mute.createdAt);
            const duration = Math.round(moment(mute.dateEnd).diff(date, "seconds", true));
            res += `• [${date.fromNow()}]\t${duration}s\t(by ${author.tag}) - Reason: ${mute.reason}\n`;
        }
        return msg.reply(res);
    }

    async run2(msg: CommandoMessage, args: { member: GuildMember | null }): Promise<Message | Message[]> {
        if (!args.member) return this.showOngoingMutes(msg);
        return this.showMutes(msg, args.member);
    }
}
