import { CommandoMessage } from "discord.js-commando";
import { Message, Role } from "discord.js";

import CorniCommand from "../../Engine/CorniCommand";
import Cornibot from "../../Engine/CorniBot";
import Config from "../../Engine/Config";

export default class AddNumbersCommand extends CorniCommand {
    constructor(client: Cornibot) {
        super(client, {
            name: "role",
            group: "general",
            memberName: "role",
            allowedChannels: ["667843839356305468"],
            description: "Get info about roles",
            examples: ["role list"],
            args: [
                {
                    key: "action",
                    label: "action",
                    prompt: "What action would you like to do? (<list|add|remove>)",
                    type: "string",
                    default: "list",
                    oneOf: ["list", "add", "remove"],
                },
                {
                    key: "role",
                    label: "role",
                    prompt: "What role would you like to add/remove?",
                    type: "role",
                    default: "",
                },
            ],
        });
    }

    async GetFreeRoles(): Promise<Role[]> {
        const freeRoles: Role[] = [];
        for (const roleID of Config.freeRoles) {
            const role = await this.client.GetGuild().roles.fetch(roleID);
            if (role) freeRoles.push(role);
        }
        return freeRoles;
    }

    async run2(msg: CommandoMessage, args: { action: "list" | "add" | "remove"; role: Role }): Promise<Message | Message[]> {
        const freeRoles = await this.GetFreeRoles();
        switch (args.action) {
            case "list": {
                let message = "**The following roles are available on this server:**```\n";
                freeRoles.forEach((role) => {
                    message += `${this.client.commandPrefix}role add/remove ${role.name}\n`;
                });
                message += "```";
                return msg.say(message);
            }
            case "add":
                if (!freeRoles.includes(args.role)) return msg.reply(`you cannot add this role.`);
                await msg.member.roles.add(args.role);
                return msg.reply(`you now have the role of **${args.role.name}**.`);
            case "remove":
                if (!freeRoles.includes(args.role)) return msg.reply(`you cannot remove this role.`);
                await msg.member.roles.remove(args.role);
                return msg.reply(`your role of **${args.role.name}** has been removed.`);
        }
    }
}
