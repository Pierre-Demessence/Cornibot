import * as Discord from "discord.js";

import ACommand from "../ACommand";

export default class KickCommand extends ACommand {
    public Args = true;
    public Description = "Kick people!";
    public Name = "kick";
    public async Run(msg: Discord.Message, ..._args: string[]): Promise<string> {
        const memberToKick = msg.mentions.members?.first();
        if (!memberToKick) return Promise.resolve("Missing target.");
        if (!msg.member?.roles.find((role) => role.id === "358079416196268032")) Promise.resolve("You don't have the permissions to do that.");
        msg.channel.send(`${msg.author} is trying to kick ${memberToKick}...`);
        try {
            await memberToKick.kick();
            return Promise.resolve(`${memberToKick} has been successfully kicked!`);
        } catch (error) {
            return Promise.reject(`Error while kicking ${memberToKick}: ${error}`);
        }
    }
}
