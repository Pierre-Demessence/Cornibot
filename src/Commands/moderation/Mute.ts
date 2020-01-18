import { CommandoClient, Command, CommandoMessage, Argument } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";
import ms from "ms";
import moment from "moment";

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
        moment.locale("FR_FR");
        return msg.say(
            `${args.member} has been muted until ${moment()
                .add(args.duration, "seconds")
                .toLocaleString()} (${args.duration}s)${args.reason ? ` for ${args.reason}` : ""}.`
        );
    }
}
