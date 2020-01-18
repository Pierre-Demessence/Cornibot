import * as path from "path";
import * as fs from "fs";
import { CommandoClient } from "discord.js-commando";

import Logger from "../Utils/Logger";
import Service from "./Service";

export default class ServiceManager {
    private services: Service[] = [];
    private client: CommandoClient;

    constructor(client: CommandoClient, pathToLoad: string) {
        this.client = client;
        this.Load(pathToLoad);
    }

    private async Load(pathToLoad: string): Promise<void> {
        const serviceFiles = fs.readdirSync(pathToLoad).filter(file => file.endsWith(".ts"));

        for (const file of serviceFiles) {
            const pathToFile = path.resolve(pathToLoad, file);
            const serviceClass = await import(pathToFile);
            try {
                if (typeof serviceClass.default !== "function") throw Error(`File ${file} is not a module.`);
                const instance = new serviceClass.default(this.client);
                if (!(instance instanceof Service)) throw Error(`Module ${file} does not inherit from Observer.`);
                const service = instance as Service;
                this.services.push(service);
                Logger.debug(`Registered observer ${service.name}`);
            } catch (e) {
                Logger.error(`Tried to load a non Observer: ${pathToFile}`, e);
            }
        }
    }

    public StartServices(): void {
        this.services.forEach(service => service.Run());
    }
}
