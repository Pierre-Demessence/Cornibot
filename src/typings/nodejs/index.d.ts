declare namespace NodeJS {
    export interface ProcessEnv {
        CMD_PREFIX: string;
        DB_FORCE_EXTERNAL?: string;
        DB_URL?: string;
        GUILD_ID: string;
        NODE_ENV: "development" | "production";
        OWNER_ID: string;
        PORT?: string;
        SQLITE_DB_PATH: string;
        TOKEN: string;
    }
}
