import Cornibot from "./CorniBot";

type ServiceInfo = {
    name: string;
};

export default abstract class Service {
    private info: ServiceInfo;
    protected client: Cornibot;

    constructor(client: Cornibot, info: ServiceInfo) {
        this.client = client;
        this.info = info;
    }

    get name(): string {
        return this.info.name;
    }

    public abstract Run(): void;
}
