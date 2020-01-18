import Logger from "../Utils/Logger";

let config = {
    owner: "",
    prefix: "!",
    token: "",
    thanksWords: ["thanks"]
};
try {
    config = require("../../config.json");
} catch (err) {
    Logger.error("Can't load config file:", err);
}

export const owner: string = config.owner;
export const prefix: string = config.prefix;
export const token: string = config.token;
export const thanksWords: string[] = config.thanksWords;
