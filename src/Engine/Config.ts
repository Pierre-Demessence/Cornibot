import Logger from "../Utils/Logger";
import { Snowflake } from "discord.js";

export type FeedInfo = {
    channelID: string;
    checkInterval: number;
    enabled: boolean;
    messageFormat: string;
    url: string;
};

type ConfigInfo = {
    databaseUri: string;
    forceDatabaseUri: boolean;
    freeRoles: Snowflake[];
    guildID: Snowflake;
    mutedRoleID: Snowflake;
    ownerID: Snowflake;
    prefix: string;
    rssFeeds: Array<FeedInfo>;
    thanksWords: string[];
    token: string;
};

let config: ConfigInfo = {
    databaseUri: "",
    forceDatabaseUri: false,
    freeRoles: [],
    guildID: "",
    mutedRoleID: "",
    ownerID: "",
    prefix: "!",
    rssFeeds: [],
    thanksWords: ["thanks"],
    token: ""
};
try {
    config = require("../../config.json");
} catch (err) {
    Logger.error("Can't load config file:", err);
}

export default config;
