import { GuildMember } from "discord.js";

import GuildMemberAddObserver from "../Engine/ObserverTypes/GuildMemberAddObserver";
import User from "../Models/User";
import Cornibot from "../Engine/CorniBot";

export default class NewMemberObserver extends GuildMemberAddObserver {
    constructor(client: Cornibot) {
        super(client, {
            name: "new_member",
        });
    }

    public async Run(member: GuildMember): Promise<void> {
        await new User({ _id: member.id }).save();
    }
}
