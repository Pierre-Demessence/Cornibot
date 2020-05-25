import * as path from "path";
import * as fs from "fs";

import Logger from "../Utils/Logger";
import Service from "./Service";
import Cornibot from "./CorniBot";

export default class ServiceLoader {
    private services: Map<Function, Service> = new Map();
    private client: Cornibot;

    constructor(client: Cornibot, pathToLoad: string) {
        this.client = client;
        this.Load(pathToLoad);
    }

    private async Load(pathToLoad: string): Promise<void> {
        const serviceFiles = fs.readdirSync(pathToLoad).filter((file) => file.endsWith(".ts"));

        for (const file of serviceFiles) {
            const pathToFile = path.resolve(pathToLoad, file);
            const serviceClass = await import(pathToFile);
            try {
                if (typeof serviceClass.default !== "function") throw Error(`File ${file} is not a module.`);
                const instance = new serviceClass.default(this.client);
                if (!(instance instanceof Service)) throw Error(`Module ${file} does not inherit from Service.`);
                const service = instance as Service;
                this.services.set(serviceClass.default, service);
                Logger.silly(`Registered service ${service.name}`);
            } catch (e) {
                Logger.error(`Tried to load a non Service: ${pathToFile}`, e);
            }
        }
    }

    public StartServices(): void {
        this.services.forEach((service) => service.Run());
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public GetService<T extends Service>(type: new (...args: any[]) => T): T | undefined {
        return this.services.get(type) as T;
    }
}
