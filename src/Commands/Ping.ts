import * as Discord from "discord.js";

import ACommand from "../ACommand";

export default class PingCommand extends ACommand {
    public Args = false;
    public Cooldown = 5;
    public Description = "Ping!";
    public GuildOnly = false;
    public Name = "ping";

    public Run(msg: Discord.Message, ..._args: string[]): Promise<string> {
        return Promise.resolve(`Pong in ${new Date().getTime() - msg.createdTimestamp}ms`);
    }
}
