import Logger from "../Utils/Logger";
import Cornibot from "./CorniBot";

export type ObserverInfo = {
    name: string;
};

/**
 * @typeparam T Parameter that the Observer will take
 */
export default abstract class Observer<T> {
    protected info: ObserverInfo;
    protected client: Cornibot;

    constructor(client: Cornibot, info: ObserverInfo) {
        this.client = client;
        this.info = info;
    }

    abstract get event(): string;

    get name(): string {
        return this.info.name;
    }

    public CheckAndRun(param: T): void {
        if (this.Check(param)) {
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
