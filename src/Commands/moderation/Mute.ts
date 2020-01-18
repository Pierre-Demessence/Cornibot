import { CommandoClient, Command, CommandoMessage, Argument } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";
import ms from "ms";
import moment from "moment";
import { mutedRole } from "../../Engine/Config";

export default class UserInfoCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            memberName: "mute",
            group: "moderation",
            name: "mute",
            aliases: [],
            description: "Mute a user.",
            examples: ["mute @Crawl#3208", "mute Crawl"],
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MUTE_MEMBERS"],
            guildOnly: true,
            args: [
                {
                    key: "member",
                    label: "user",
                    prompt: "What user would you like to snoop on?",
                    type: "member"
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
                    }
                },
                {
                    key: "reason",
                    label: "reason",
                    prompt: "What reason?",
                    type: "string",
                    default: ""
                }
            ]
        });
    }

    async run(msg: CommandoMessage, args: { member: GuildMember; duration: number; reason: string }): Promise<Message | Message[]> {
        if (msg.member.roles.highest.comparePositionTo(args.member.roles.highest) <= 0) {
            return msg.reply(`you can't mute ${args.member}`);
        }

        args.member.roles.add(mutedRole);
        moment.locale("FR_FR");
        const muteDuration = moment.duration(args.duration, "seconds");
        const durations: string[] = [];
        (["year", "month", "day", "hour", "minute", "second"] as moment.unitOfTime.Base[]).forEach(a => {
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
        let answer = `${args.member} has been muted for ${res} (${args.duration}s)`;
        // let answer = `${args.member} has been muted until ${muteDuration.toLocaleString()}`;
        if (args.reason) answer += ` for ${args.reason}`;
        answer += ".";

        return msg.say(answer);
    }
}
