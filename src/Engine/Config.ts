import Logger from "../Utils/Logger";

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
    guildID: string;
    mutedRoleID: string;
    ownerID: string;
    prefix: string;
    rssFeeds: Array<FeedInfo>;
    thanksWords: string[];
    token: string;
};

let config: ConfigInfo = {
    databaseUri: "",
    forceDatabaseUri: false,
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
