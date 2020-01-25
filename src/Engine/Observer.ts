import Logger from "../Utils/Logger";
import DiscordBot from "./DiscordBot";

export type ObserverInfo = {
    name: string;
};

/**
 * @typeparam T Parameter that the Observer will take
 */
export default abstract class Observer<T> {
    protected info: ObserverInfo;
    protected client: DiscordBot;

    constructor(client: DiscordBot, info: ObserverInfo) {
        this.client = client;
        this.info = info;
    }

    abstract get event(): string;

    get name(): string {
        return this.info.name;
    }

    public CheckAndRun(param: T): void {
        // Logger.silly(`Checking Observer ${this.name}.`);
        if (this.Check(param)) {
            // Logger.silly(`Running Observer ${this.name}.`);
            try {
                this.Run(param);
            } catch (err) {
                Logger.error(`Error while running ${this.name}:`, err);
            }
        }
    }

    /**
     * Check whether or not the Observer should be called.
     */
    protected abstract Check(param: T): boolean;

    protected abstract Run(param: T): void;
}
