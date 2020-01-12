import * as Discord from "discord.js";
import stringArgv from 'string-argv';

import ACommandManager from "../ACommandManager";
import Logger from "../Logger";

// tslint:disable-next-line: no-var-requires
import { prefix } from "../Config";

export default class PrefixManager extends ACommandManager {
    public async Parse(message: Discord.Message | Discord.PartialMessage): Promise<void> {
        if (!message.content?.startsWith(prefix) || message.author?.bot) return;

        Logger.silly(`Received message: ${message.content}`);
        const args = stringArgv(message.content.slice(prefix.length));
        const commandName = args.shift()?.toLowerCase();
        Logger.debug(`Command: ${commandName}`);
        Logger.debug(`Args: ${args.join(",")}`);

        if (!commandName) return;
        const command = this.commandLoader.Get(commandName);

        if (!command) {
            message.reply?.("Unknown command.");
            return;
        }

        if (command.GuildOnly && message.channel?.type !== "text") {
            message.reply?.("I can't execute this command inside DMs!");
            return;
        }

        if (command.Args && !args.length) {
            const reply = `You didn't provide any arguments, ${message.author}!`;

            /*
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.Name} ${command.usage}\``;
            }
            */

            message.channel?.send(reply);
            return;
        }

        /*
        if (!cooldowns.has(command.Name)) {
            cooldowns.set(command.Name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.Name);
        const cooldownAmount = (command.CoolDown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.Name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        */

        try {
            console.log("a")
            const answer = await command.Run(message, ...args)
            console.log("b")
            message.reply?.(answer);
            console.log("c")
        } catch (error) {
            Logger.error("", error);
            message.reply?.(`there was an error trying to execute that command. ${process.env.NODE_ENV !== "production" ? error.message : ""}`);
        }
        return;
    }

}
