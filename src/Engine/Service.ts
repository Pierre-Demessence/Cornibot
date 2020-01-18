import { CommandoClient } from "discord.js-commando";

type ServiceInfo = {
    name: string;
};

export default abstract class Service {
    private info: ServiceInfo;
    protected client: CommandoClient;

    constructor(client: CommandoClient, info: ServiceInfo) {
        this.client = client;
        this.info = info;
    }

    get name(): string {
        return this.info.name;
    }

    public abstract Run(): void;
}
