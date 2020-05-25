import { Message } from "discord.js";
import { Command, CommandInfo, CommandoMessage } from "discord.js-commando";

import Cornibot from "./CorniBot";

interface CorniCommandInfo extends CommandInfo {
    allowedRoles?: string[];
    allowedChannels?: string[];
    deleteCommand?: boolean;
}

export default abstract class CorniCommand extends Command {
    public client!: Cornibot;
    public allowedRoles: string[];
    public allowedChannels: string[];
    public deleteCommand: boolean;

    constructor(client: Cornibot, info: CorniCommandInfo) {
        super(client, info);
        this.allowedRoles = info.allowedRoles || [];
        this.allowedChannels = info.allowedChannels || [];
        this.deleteCommand = info.deleteCommand || false;
    }

    hasPermission(message: CommandoMessage, ownerOverride: boolean): boolean | string {
        const res = super.hasPermission(message, ownerOverride);
        if (!res) return res;
        if (this.allowedRoles.length > 0) return this.allowedRoles.some((role) => message.member.roles.cache.has(role));
        if (this.allowedChannels.length > 0 && !this.allowedChannels.includes(message.channel.id)) return "You can't use this command in this channel.";
        return true;
    }

    async run(msg: CommandoMessage, args: unknown): Promise<Message | Message[] | null> {
        if (this.deleteCommand) await msg.delete();
        return this.run2(msg, args);
    }

    abstract run2(msg: CommandoMessage, args: unknown): Promise<Message | Message[] | null>;
}
