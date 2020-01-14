import { CommandoClient, FriendlyError } from "discord.js-commando";
import path from "path";

import Logger from "../Utils/Logger";
import { owner, prefix, token } from "./Config";

export default class DiscordBot {
    private client: CommandoClient;

    constructor() {
        this.client = new CommandoClient({
            owner,
            commandPrefix: prefix,
            nonCommandEditable: false
        });

        this.client
            .on("warn", message => Logger.warn(message))
            .on("error", message => Logger.error(message))
            .on("debug", message => Logger.debug(message))
            .on("ready", () => Logger.info(`Client ready; logged in as ${this.client.user?.tag} (${this.client.user?.id})`))
            .on("disconnect", () => Logger.warn("Disconnected!"))
            .on("reconnecting", () => Logger.warn("Reconnecting..."))
            .on("commandError", (cmd, err) => {
                if (err instanceof FriendlyError) return;
                Logger.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
            })
            .on("commandBlock", (msg, reason) => Logger.warn(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""} blocked; ${reason}`))
            .on("commandPrefixChange", (guild, prefix) => Logger.info(`Prefix ${prefix === "" ? "removed" : `changed to ${prefix || "the default"}`} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.`))
            .on("commandStatusChange", (guild, command, enabled) => Logger.info(`Command ${command.groupID}:${command.memberName} ${enabled ? "enabled" : "disabled"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.`))
            .on("groupStatusChange", (guild, group, enabled) => Logger.info(`Group ${group.id} ${enabled ? "enabled" : "disabled"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.`));

        this.client.registry
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
                eval: false,
                prefix: false,
                commandState: false
            })
            .registerGroups([
                ["general", "General commands"],
                ["math", "Maths commands"]
            ])
            .registerCommandsIn({
                dirname: path.join(__dirname, "../Commands"),
                filter: /^([^.].*)\.[jt]s$/
            });
    }

    public Start(): void {
        this.client.login(token);
    }
}
