import Logger from "../Utils/Logger";

let config = {
    databaseUri: "",
    forceDatabaseUri: false,
    guildID: "",
    mutedRoleID: "",
    ownerID: "",
    prefix: "!",
    thanksWords: ["thanks"],
    token: ""
};
try {
    config = require("../../config.json");
} catch (err) {
    Logger.error("Can't load config file:", err);
}

export default config;
