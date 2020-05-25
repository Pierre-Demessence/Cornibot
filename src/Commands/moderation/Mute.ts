import { CommandoMessage, Argument } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";
import ms from "ms";
import moment from "moment";

import Config from "../../Engine/Config";
import Mute from "../../Models/Mute";
import UnmuteService from "../../Services/UnmuteService";
import Cornibot from "../../Engine/CorniBot";
import CorniCommand from "../../Engine/CorniCommand";
import Logger from "../../Utils/Logger";

export default class MuteCommand extends CorniCommand {
    constructor(client: Cornibot) {
        super(client, {
            memberName: "mute",
            group: "moderation",
            name: "mute",
            aliases: [],
            description: "Mute a user.",
            examples: ["mute @Foo#0123 60", 'mute @Foo#0123 "3 hours"', 'mute @Foo#0123 60 "some reason"', 'mute @Foo#0123 "3 hours" "some reason"'],
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MUTE_MEMBERS"],
            guildOnly: true,
            deleteCommand: true,
            args: [
                {
                    key: "member",
                    label: "user",
                    prompt: "What user would you like to mute?",
                    type: "member",
                },
                {
                    key: "duration",
                    label: "duration",
                    prompt: "What duration?",
                    type: "integer",
                    parse: (val: string, _msg: CommandoMessage, _arg: Argument): unknown | Promise<unknown> => {
                        if (/^\d+$/.test(val)) return parseInt(val);
                        return ms(val) / 1000;
                    },
                    validate: (val: string, _msg: CommandoMessage, _arg: Argument): boolean | string | Promise<boolean | string> => {
                        let duration;
                        if (/^\d+$/.test(val)) duration = parseInt(val);
                        else duration = ms(val) / 1000;
                        if (Number.isNaN(duration)) return false;
                        if (!Number.isInteger(duration)) return false;
                        if (duration <= 0) return false;
                        if (duration >= ms("100 years") / 1000) return false;
                        return true;
                    },
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

    async run2(msg: CommandoMessage, args: { member: GuildMember; duration: number; reason: string }): Promise<Message | Message[]> {
        if (!msg.guild.me?.permissions.has("ADMINISTRATOR") && msg.member.roles.highest.comparePositionTo(args.member.roles.highest) <= 0) {
            return msg.reply(`you can't mute ${args.member.user.tag}.`);
        }
        if (args.member.roles.cache.has(Config.mutedRoleID)) {
            return msg.reply(`${args.member.user.tag} is already muted.`);
        }

        const muteDuration = moment.duration(args.duration, "seconds");

        const mute = new Mute({
            user: args.member.id,
            author: msg.author.id,
            dateEnd: moment().add(muteDuration),
            reason: args.reason,
            channel: msg.channel.id,
        });
        await mute.save();
        await args.member.roles.add(Config.mutedRoleID, args.reason);
        this.client.GetService(UnmuteService)?.StartTimer(mute);

        const durations: string[] = [];
        (["year", "month", "day", "hour", "minute", "second"] as moment.unitOfTime.Base[]).forEach((a) => {
            const amount = muteDuration.get(a);
            if (amount === 0) return;
            if (amount >= 1) a += "s";
            durations.push(`${amount} ${a}`);
        });

        let res: string;
        if (durations.length > 1) {
            const last = durations.pop();
            res = durations.join(", ") + " and " + last;
        } else res = durations.join(", ");
        let answer = `${args.member.user.tag} has been muted for ${res} (${args.duration}s)`;
        // let answer = `${args.member} has been muted until ${muteDuration.toLocaleString()}`;
        if (args.reason) answer += ` for ${args.reason}`;
        answer += ".";
        // You have been muted from UDC for 5 hours, 59 minutes and 59 seconds for the following reason : Go the fudge to sleep.

        await args.member.send(`You have been muted from ${msg.guild.name} for **${res} (${args.duration}s)** for the following reason : **${args.reason}**.`);
        return msg.say(answer);
    }
}
