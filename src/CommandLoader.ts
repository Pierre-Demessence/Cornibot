import * as Discord from "discord.js";
import * as fs from "fs";
import * as path from "path";

import ACommand from "./ACommand";

export default class CommandLoader {
    private commands = new Discord.Collection<string, ACommand>();

    constructor() {
        this.Load();
    }

    public Get(commandName: string): ACommand | undefined {
        return this.commands.get(commandName) || this.commands.find((cmd) => cmd.Aliases && cmd.Aliases.includes(commandName));
    }

    private Load() {
        const commandFiles = fs.readdirSync(path.resolve(`${__dirname}/Commands`)).filter((file) => file.endsWith(".ts"));

        for (const file of commandFiles) {
            const commandClass = require(path.resolve(`${__dirname}/Commands/${file}`));
            const command = new commandClass.default() as ACommand;
            this.commands.set(command.Name, command);
            console.debug(`Added command ${command.Name}`);
        }
    }
}
