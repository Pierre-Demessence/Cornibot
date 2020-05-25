import { CommandoMessage } from "discord.js-commando";
import { Message, Role } from "discord.js";

import CorniCommand from "../../Engine/CorniCommand";
import Cornibot from "../../Engine/CorniBot";

export default class ClearCommand extends CorniCommand {
    constructor(client: Cornibot) {
        super(client, {
            memberName: "tagrole",
            group: "moderation",
            name: "tagrole",
            aliases: ["pingrole"],
            description: "Tag a role with a message.",
            examples: ['tagrole Admin "hi"'],
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MANAGE_ROLES"],
            guildOnly: true,
            args: [
                {
                    key: "role",
                    label: "role",
                    prompt: "What role would you like to ping?",
                    type: "role",
                },
                {
                    key: "message",
                    label: "message",
                    prompt: "What message would you like to write?",
                    type: "string",
                },
            ],
        });
    }

    async run2(msg: CommandoMessage, args: { role: Role; message: string }): Promise<Message | Message[] | null> {
        const before = args.role.mentionable;
        if (!args.role.mentionable) {
            const me = msg.guild.me;
            if (!me) throw Error("Should never happen.");
            if (args.role.comparePositionTo(me.roles.highest) >= 0) return msg.reply("I don't have the rights to make this role mentionable.");
            await args.role.setMentionable(true);
        }
        await msg.channel.send(`${args.role} ${args.message}`);
        if (args.role.mentionable !== before) await args.role.setMentionable(before);
        return null;
    }
}
