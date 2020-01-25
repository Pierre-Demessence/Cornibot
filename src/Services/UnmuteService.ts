import moment from "moment";
import { TextChannel } from "discord.js";

import Service from "../Engine/Service";
import MuteModel, { Mute } from "../Models/Mute";
import Config from "../Engine/Config";
import Logger from "../Utils/Logger";
import DiscordBot from "../Engine/DiscordBot";

export default class UnmuteService extends Service {
    public int = 0;
    constructor(client: DiscordBot) {
        super(client, {
            name: "unmute"
        });
    }

    public StartTimer(mute: Mute): void {
        const milliseconds = moment(mute.dateEnd).diff(moment(), "milliseconds");
        Logger.debug(`Starting an Unmute Timer for ${milliseconds}ms`);
        setTimeout(async () => {
            const channel = this.client.GetGuild().channels.get(mute.channel) as TextChannel;
            const member = await this.client.GetGuild().members.fetch(mute.user);
            channel.send(`${member?.user.tag} has been unmuted.`);
            Logger.debug(`${member?.user.tag} has been unmuted.`);
            await member?.roles.remove(Config.mutedRoleID);
        }, milliseconds);
    }

    public async Run(): Promise<void> {
        this.int = 1;
        const mutes = await MuteModel.find({
            dateEnd: {
                $gt: new Date()
            }
        });
        mutes.forEach(mute => this.StartTimer(mute));
    }
}
