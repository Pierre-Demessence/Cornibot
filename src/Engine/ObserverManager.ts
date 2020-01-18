import * as path from "path";
import * as fs from "fs";
import { Message } from "discord.js";
import { CommandoClient } from "discord.js-commando";

import Logger from "../Utils/Logger";
import Observer from "./Observer";

export default class ObserverManager {
    private observers: Observer[] = [];
    private client: CommandoClient;

    constructor(client: CommandoClient, pathToLoad: string) {
        this.client = client;
        this.Load(pathToLoad);
    }

    private async Load(pathToLoad: string): Promise<void> {
        const observerFiles = fs.readdirSync(pathToLoad).filter(file => file.endsWith(".ts"));

        for (const file of observerFiles) {
            const pathToFile = path.resolve(pathToLoad, file);
            const observerClass = await import(pathToFile);
            try {
                if (typeof observerClass.default !== "function") throw Error(`File ${file} is not a module.`);
                const instance = new observerClass.default(this.client);
                if (!(instance instanceof Observer)) throw Error(`Module ${file} does not inherit from Observer.`);
                const observer = instance as Observer;
                this.observers.push(observer);
                Logger.debug(`Registered observer ${observer.name}`);
            } catch (e) {
                Logger.error(`Tried to load a non Observer: ${pathToFile}`, e);
            }
        }
    }

    public Observe(message: Message): void {
        if (message.author.bot) return;
        this.observers.forEach(observer => {
            if (!observer.matchCommands && message.content.startsWith(this.client.commandPrefix)) return;
            if (observer.pattern.test(message.content)) observer.Run(message);
        });
    }
}
