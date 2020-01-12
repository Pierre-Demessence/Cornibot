import Logger from "./Logger";

let config = {
    prefix: "!",
    token: ""
};
try {
    config = require("../config.json");
} catch(err) {
    Logger.error("Can't load config file:", err);
}

export const prefix = config.prefix;
export const token = config.token;