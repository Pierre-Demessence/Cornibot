declare namespace NodeJS {
    export interface ProcessEnv {
        CMD_PREFIX: string;
        DB_FORCE_EXTERNAL?: string;
        DB_URL?: string;
        GUILD_ID: string;
        OWNER_ID: string;
        PORT?: string;
        TOKEN: string;
    }
}
