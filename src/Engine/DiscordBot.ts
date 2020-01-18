import { CommandoClient, FriendlyError } from "discord.js-commando";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import path from "path";

import Logger from "../Utils/Logger";
import { owner, prefix, token } from "./Config";
import ObserverManager from "./ObserverManager";

const mongod = new MongoMemoryServer();

export default class DiscordBot {
    private client: CommandoClient;
    private observerManager: ObserverManager;

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
                ["moderation", "Moderation commands"],
                ["math", "Maths commands"]
            ])
            .registerCommandsIn({
                dirname: path.join(__dirname, "../Commands"),
                filter: /^([^.].*)\.[jt]s$/
            });

        this.observerManager = new ObserverManager(this.client, path.join(__dirname, "../Observers"));

        this.client.on("message", async message => {
            this.observerManager.Observe(message);
        });
    }

    public async Start(): Promise<void> {
        const dbUri = await mongod.getUri(true);
        await mongoose.connect(dbUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        Logger.info(`Connected to DB at ${dbUri}`);
        this.client.login(token);
    }
}
