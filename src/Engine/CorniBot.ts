import { Guild } from "discord.js";
import { CommandoClient, FriendlyError } from "discord.js-commando";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import path from "path";

import Logger from "../Utils/Logger";
import Config from "./Config";
import ObserverLoader from "./ObserverLoader";
import ServiceLoader from "./ServiceLoader";
import Service from "./Service";
import routes from "../WebServer/Routes";

export default class Cornibot extends CommandoClient {
    private observerLoader: ObserverLoader;
    private serviceLoader: ServiceLoader;

    constructor() {
        super({
            owner: Config.ownerID,
            commandPrefix: Config.prefix,
            nonCommandEditable: false,
        });

        this.on("warn", (message) => Logger.warn(message))
            .on("error", (message) => Logger.error(message))
            .on("debug", (message) => Logger.debug(message))
            .on("ready", () => Logger.info(`Client ready; logged in as ${this.user?.tag} (${this.user?.id})`))
            .on("disconnect", () => Logger.warn("Disconnected!"))
            .on("reconnecting", () => Logger.warn("Reconnecting..."))
            .on("commandError", (cmd, err) => {
                if (err instanceof FriendlyError) return;
                Logger.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
            })
            .on("commandBlock", (msg, reason) => Logger.warn(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""} blocked; ${reason}`))
            .on("commandPrefixChange", (guild, prefix) =>
                Logger.info(`Prefix ${prefix === "" ? "removed" : `changed to ${prefix || "the default"}`} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.`)
            )
            .on("commandStatusChange", (guild, command, enabled) =>
                Logger.info(`Command ${command.groupID}:${command.memberName} ${enabled ? "enabled" : "disabled"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.`)
            )
            .on("groupStatusChange", (guild, group, enabled) => Logger.info(`Group ${group.id} ${enabled ? "enabled" : "disabled"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.`));

        this.registry
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
                eval: false,
                prefix: false,
                commandState: false,
            })
            .registerGroups([
                ["general", "General commands"],
                ["moderation", "Moderation commands"],
                ["fun", "Fun commands"],
            ])
            .registerCommandsIn({
                dirname: path.join(__dirname, "../Commands"),
                filter: /^([^.].*)\.[jt]s$/,
            });

        this.observerLoader = new ObserverLoader(this, path.join(__dirname, "../Observers"));
        this.serviceLoader = new ServiceLoader(this, path.join(__dirname, "../Services"));
    }

    public async Start(): Promise<void> {
        let dbUri: string;
        if (process.env.NODE_ENV === "production" || Config.forceDatabaseUri) dbUri = Config.databaseUri;
        else {
            const mongod = new MongoMemoryServer({
                instance: {
                    port: 4242,
                },
            });
            dbUri = await mongod.getUri("cornibot-dev");
        }
        await mongoose.connect(dbUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        Logger.info(`Connected to DB at ${dbUri}`);
        await this.login(Config.token);
        if (this.guilds.cache.size > 1 || this.guilds.cache.first()?.id !== Config.guildID) {
            this.destroy();
            Logger.error("One instance of the bot should never be in more than one server.");
        }
        this.serviceLoader.StartServices();
        this.observerLoader.StartObservers();

        const app = express();

        app.use(routes);

        app.listen(process.env.PORT, () => Logger.info(`WebServer listening on port ${process.env.PORT}`));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public GetService<T extends Service>(type: new (...args: any[]) => T): T | undefined {
        return this.serviceLoader.GetService<T>(type);
    }

    public GetGuild(): Guild {
        const guild = this.guilds.resolve(Config.guildID);
        if (!guild) throw Error("Should never happend.");
        return guild;
    }
}
