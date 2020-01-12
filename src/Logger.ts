import winston from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";

const addErrorStack = winston.format((info) => {
    if (info.error) info.stack = info.error.stack;
    return info;
});

const winstonFormat = winston.format.combine(
    addErrorStack(),
    winston.format.timestamp(),
    winston.format.printf((info) => {
        if (info.stack) return `[${info.timestamp}] ${info.level}: ${info.message.replace(info.stack.match(/Error: (.*)/)?.[1], "")}\n${info.stack}`
        return `[${info.timestamp}] ${info.level}: ${info.message}`;
    }),
);

const commonConfig = {
    datePattern: "YYYY-MM-DD",
    dirname: "logs/%DATE%/",
    maxFiles: 30,
};

const logger = winston.createLogger({
    format: winston.format.combine(
        winstonFormat
    ),
    level: "silly",
    transports: [
        new (winstonDailyRotateFile)({ ...commonConfig, filename: "0-error.log", level: "error" }),
        new winstonDailyRotateFile({ ...commonConfig, filename: "1-warning.log", level: "warn" }),
        new winstonDailyRotateFile({ ...commonConfig, filename: "2-info.log", level: "info" }),
        new winstonDailyRotateFile({ ...commonConfig, filename: "4-debug.log", level: "debug" }),
        new winstonDailyRotateFile({ ...commonConfig, filename: "5-silly.log" }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.cli(),
            winstonFormat,
        ),
        level: "silly",
    }));
}

export default logger;
