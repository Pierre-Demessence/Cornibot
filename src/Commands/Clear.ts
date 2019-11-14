import * as Discord from "discord.js";

import ACommand from "../ACommand";

export default class ClearCommand extends ACommand {
    public Args: boolean = true;
    public Description: string = "Clean messages!";
    public Name: string = "clear";
    public async Run(msg: Discord.Message, _argsA: any[] | undefined, _argsO: {[key: string]: any} | undefined): Promise<string> {
        if (!msg.member?.roles.find((role) => role.id === "358079416196268032")) throw new Error("You don't have the permissions to do that.");

        const amount = _argsA?.[0] || _argsO?.fields?.number?.numberValue;
        if (typeof amount !== "number" || amount <= 0) throw new Error("The number of message was not specified");
        await msg.channel.bulkDelete(amount + 1);
        return Promise.resolve("Messages deleted.");
    }
}
