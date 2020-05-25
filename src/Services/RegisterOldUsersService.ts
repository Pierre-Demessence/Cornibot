import Service from "../Engine/Service";
import User from "../Models/User";
import Cornibot from "../Engine/CorniBot";
import Logger from "../Utils/Logger";

export default class RegisterOldUsersService extends Service {
    constructor(client: Cornibot) {
        super(client, {
            name: "register_old_users",
        });
    }

    public async Run(): Promise<void> {
        Logger.silly("Registering current users...");
        const members = await this.client.GetGuild().members.fetch();
        for (const [, member] of members) {
            await User.findByIdAndUpdate(
                member.id,
                {},
                {
                    upsert: true,
                }
            );
        }
        Logger.silly("Current users registration done.");
    }
}
