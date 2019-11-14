import * as Discord from "discord.js";

import ACommandManager from "../ACommandManager";

// tslint:disable-next-line: no-var-requires
const { prefix} = require("./../config.json");

export default class PrefixManager extends ACommandManager {
    public Parse(message: Discord.Message | Discord.PartialMessage): void {
        if (!message.content?.startsWith(prefix) || message.author?.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;
        const command = this.commandLoader.Get(commandName);

        if (!command) return;

        if (command.GuildOnly && message.channel?.type !== "text") {
            message.reply?.("I can't execute that command inside DMs!");
            return;
        }

        console.log(args);
        if (command.Args && !args.length) {
            const reply = `You didn't provide any arguments, ${message.author}!`;

            /*
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.Name} ${command.usage}\``;
            }
            */

            message.channel?.send(reply);
            return ;
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
            command.Run(message, args, {})
                .then((answer) => message.reply?.(answer))
                .catch((error) => {
                    console.error(error);
                    message.reply?.("there was an error trying to execute that command!");
                });
        } catch (error) {
            console.error(error);
            message.reply?.("there was an error trying to execute that command!");
        }
        return;
    }

}
