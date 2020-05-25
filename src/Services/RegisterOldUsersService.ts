import Service from "../Engine/Service";
import User from "../Models/User";
import Cornibot from "../Engine/CorniBot";

export default class RegisterOldUsersService extends Service {
    constructor(client: Cornibot) {
        super(client, {
            name: "register_old_users",
        });
    }

    public async Run(): Promise<void> {
        const members = await this.client.GetGuild().members.fetch();
        members?.forEach((member) =>
            User.findByIdAndUpdate(
                member.id,
                {},
                {
                    upsert: true,
                }
            )
        );
    }
}
