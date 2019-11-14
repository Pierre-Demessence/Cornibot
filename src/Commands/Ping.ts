import * as Discord from "discord.js";

import ACommand from "../ACommand";

export default class PingCommand extends ACommand {
    public Args: boolean = false;
    public Cooldown: number = 5;
    public Description: string = "Ping!";
    public GuildOnly: boolean = false;
    public Name: string = "ping";

    public Run(msg: Discord.Message, _argsA: any[] | undefined, _argsO: {[key: string]: any} | undefined): Promise<string> {
        return Promise.resolve(`Pong in ${new Date().getTime() - msg.createdTimestamp}ms`);
    }
}
