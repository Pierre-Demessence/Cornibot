import { Guild } from "discord.js";
import { CommandoClient, FriendlyError, SQLiteProvider } from "discord.js-commando";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import * as sqlite from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

import Logger from "../Utils/Logger";
import ObserverLoader from "./ObserverLoader";
import ServiceLoader from "./ServiceLoader";
import Service from "./Service";

export default class Cornibot extends CommandoClient {
    private observerLoader: ObserverLoader;
    private serviceLoader: ServiceLoader;

    constructor() {
        super({
            owner: process.env.OWNER_ID,
            commandPrefix: process.env.CMD_PREFIX,
            nonCommandEditable: false,
        });

        this.on("warn", (message) => Logger.warn(message))
            .on("error", (message) => Logger.error(message))
            .on("debug", (message) => Logger.silly(message))
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

        this.observerLoader = new ObserverLoader(this, path.join(__dirname, "../Observers"));
        this.serviceLoader = new ServiceLoader(this, path.join(__dirname, "../Services"));

        this.Init();
    }

    private async Init(): Promise<void> {
        this.registry
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
                eval: false,
                prefix: false,
                commandState: true,
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

        const db = await sqlite.open({
            driver: sqlite3.Database,
            filename: process.env.SQLITE_DB_PATH,
        });

        this.setProvider(new SQLiteProvider(db));
    }

    public async Start(): Promise<void> {
        let dbUri: string;
        if ((process.env.NODE_ENV === "production" || process.env.DB_FORCE_EXTERNAL === "TRUE") && process.env.DB_URL) dbUri = process.env.DB_URL;
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
            useFindAndModify: false,
        });
        Logger.info(`Connected to DB at ${dbUri}`);
        await this.login(process.env.TOKEN);
        if (this.guilds.cache.size > 1 || this.guilds.cache.first()?.id !== process.env.GUILD_ID) {
            this.destroy();
            Logger.error("One instance of the bot should never be in more than one server.");
        }
        this.serviceLoader.StartServices();
        this.observerLoader.StartObservers();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public GetService<T extends Service>(type: new (...args: any[]) => T): T | undefined {
        return this.serviceLoader.GetService<T>(type);
    }

    public GetGuild(): Guild {
        const guild = this.guilds.resolve(process.env.GUILD_ID);
        if (!guild) throw Error("Bot is in no guild. This shouldn't happen.");
        return guild;
    }
}
