import Service from "../Engine/Service";
import User from "../Models/User";
import DiscordBot from "../Engine/DiscordBot";

export default class RegisterOldUsersService extends Service {
    constructor(client: DiscordBot) {
        super(client, {
            name: "register_old_users"
        });
    }

    public async Run(): Promise<void> {
        const members = await this.client.GetGuild().members.fetch();
        members?.forEach(member => new User({ _id: member.id }).save());
    }
}
