import "reflect-metadata";
require("dotenv-safe").config();

import moment from "moment";

import Cornibot from "./Engine/CorniBot";
import Logger from "./Utils/Logger";

moment.locale("en");

process.on("uncaughtException", async (err) => {
    Logger.error(`Uncaught Exception: ${err.stack}`);
    if (process.env.NODE_ENV === "production") return;
    Logger.error(`Exiting with status 1 in 3s`);
    setTimeout(() => process.exit(1), 3000);
});
process.on("unhandledRejection", async (err) => {
    Logger.error(`Unhandled Rejection: ${(err as any).stack || err}`);
    if (process.env.NODE_ENV === "production") return;
    Logger.error(`Exiting with status 1 in 3s`);
    setTimeout(() => process.exit(1), 3000);
});

new Cornibot().Start();
