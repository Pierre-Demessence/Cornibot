import * as Discord from "discord.js";

export default abstract class ACommand {
    public readonly abstract Args: boolean;
    public readonly CoolDown: number = 0;
    public readonly abstract Description: string;
    public readonly GuildOnly: boolean = true;
    public readonly abstract Name: string;
    protected aliases: string[] = [];
    // public readonly usage: any;

    get Aliases(): string[] {
        return this.aliases;
    }

    public abstract async Run(msg: Discord.Message | Discord.PartialMessage, _argsA: any[] | undefined, _argsO?: {[key: string]: any} | undefined): Promise<string>;
}
