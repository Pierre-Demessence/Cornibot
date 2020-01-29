import { Command, CommandInfo, CommandoMessage } from "discord.js-commando";
import DiscordBot from "./DiscordBot";

interface CorniCommandInfo extends CommandInfo {
    allowedRoles?: string[];
}

export default abstract class CorniCommand extends Command {
    public client!: DiscordBot;
    public allowedRoles: string[];

    constructor(client: DiscordBot, info: CorniCommandInfo) {
        super(client, info);
        this.allowedRoles = info.allowedRoles || [];
    }

    hasPermission(message: CommandoMessage, ownerOverride: boolean): boolean | string {
        const res = super.hasPermission(message, ownerOverride);
        if (!res) return res;
        if (this.allowedRoles.length > 0) return this.allowedRoles.some(role => message.member.roles.has(role));
        return true;
    }
}
