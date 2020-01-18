import Logger from "../Utils/Logger";

let config = {
    databaseUri: "",
    mutedRole: "",
    owner: "",
    prefix: "!",
    thanksWords: ["thanks"],
    token: ""
};
try {
    config = require("../../config.json");
} catch (err) {
    Logger.error("Can't load config file:", err);
}

export const databaseUri: string = config.owner;
export const mutedRole: string = config.mutedRole;
export const owner: string = config.owner;
export const prefix: string = config.prefix;
export const thanksWords: string[] = config.thanksWords;
export const token: string = config.token;
