import { Command, CommandInfo, CommandoMessage } from "discord.js-commando";
import DiscordBot from "./DiscordBot";

interface CorniCommandInfo extends CommandInfo {
    allowedRoles?: string[];
    allowedChannels?: string[];
}

export default abstract class CorniCommand extends Command {
    public client!: DiscordBot;
    public allowedRoles: string[];
    public allowedChannels: string[];

    constructor(client: DiscordBot, info: CorniCommandInfo) {
        super(client, info);
        this.allowedRoles = info.allowedRoles || [];
        this.allowedChannels = info.allowedChannels || [];
    }

    hasPermission(message: CommandoMessage, ownerOverride: boolean): boolean | string {
        const res = super.hasPermission(message, ownerOverride);
        if (!res) return res;
        if (this.allowedRoles.length > 0) return this.allowedRoles.some(role => message.member.roles.has(role));
        if (this.allowedChannels.length > 0 && !this.allowedChannels.includes(message.channel.id)) return "You can't use this command in this channel.";
        return true;
    }
}
