import Logger from "../Utils/Logger";

let config = {
    owner: "",
    prefix: "!",
    token: ""
};
try {
    config = require("../../config.json");
} catch(err) {
    Logger.error("Can't load config file:", err);
}

export const owner = config.owner;
export const prefix = config.prefix;
export const token = config.token;