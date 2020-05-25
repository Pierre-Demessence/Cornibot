import * as path from "path";
import * as fs from "fs";

import Logger from "../Utils/Logger";
import Observer from "./Observer";
import Cornibot from "./CorniBot";

export default class ObserverLoader {
    private observers: Observer<unknown>[] = [];
    private client: Cornibot;

    constructor(client: Cornibot, pathToLoad: string) {
        this.client = client;
        this.Load(pathToLoad);
    }

    private async Load(pathToLoad: string): Promise<void> {
        const observerFiles = fs.readdirSync(pathToLoad).filter((file) => file.endsWith(".ts"));

        for (const file of observerFiles) {
            const pathToFile = path.resolve(pathToLoad, file);
            const observerClass = await import(pathToFile);
            try {
                if (typeof observerClass.default !== "function") throw Error(`File ${file} is not a module.`);
                const instance = new observerClass.default(this.client);
                if (!(instance instanceof Observer)) throw Error(`Module ${file} does not inherit from Observer.`);
                const observer = instance as Observer<unknown>;
                this.observers.push(observer);
                Logger.debug(`Registered observer ${observer.name}`);
            } catch (e) {
                Logger.error(`Tried to load a non Observer: ${pathToFile}`, e);
            }
        }
    }

    public StartObservers(): void {
        this.observers.forEach((observer) => {
            Logger.silly(`Listening to ${observer.event} for ${observer.name}.`);
            this.client.on(observer.event, observer.CheckAndRun.bind(observer));
        });
    }
}
