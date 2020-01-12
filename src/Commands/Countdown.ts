import * as Discord from "discord.js";

import ACommand from "../ACommand";

export default class PingCommand extends ACommand {
    public Args = false;
    public CoolDown = 5;
    public Description = "Explodes!";
    public Name = "countdown";
    protected aliases: string[] = ["tick"];

    private CountDownUsers: { [tag: string]: number } = {};
    public Run(msg: Discord.Message, ..._args: string[]): Promise<string> {
        if (!Object.keys(this.CountDownUsers).includes(msg.author.tag)) {
            this.CountDownUsers[msg.author.tag] = Math.floor(Math.random() * 6 + 5);
        }
        if (this.CountDownUsers[msg.author.tag] === 0) {
            msg.member?.kick().catch((e) => (e as void));
            this.CountDownUsers[msg.author.tag] = Math.floor(Math.random() * 6 + 5);
            return Promise.resolve("BOOM :boom:");
        }
        return Promise.resolve(`${this.CountDownUsers[msg.author.tag]--} :alarm_clock:`);
    }
}
