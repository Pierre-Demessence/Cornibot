import { TextChannel } from "discord.js";
import { isRefType } from "@typegoose/typegoose";
import moment from "moment";

import Service from "../Engine/Service";
import MuteModel, { Mute } from "../Models/Mute";
import Config from "../Engine/Config";
import Logger from "../Utils/Logger";
import Cornibot from "../Engine/CorniBot";

export default class UnmuteService extends Service {
    private timers: Map<Mute, NodeJS.Timer> = new Map();
    constructor(client: Cornibot) {
        super(client, {
            name: "unmute",
        });
    }

    public async Unmute(mute: Mute): Promise<void> {
        if (!isRefType(mute.user)) throw new Error("The mute has no user");
        const member = await this.client.GetGuild().members.fetch(mute.user);
        if (!member?.roles.cache.has(Config.mutedRoleID)) {
            Logger.debug(`${member?.user.tag} was already unmuted.`);
            return;
        }
        const channel = this.client.GetGuild().channels.resolve(mute.channel) as TextChannel;
        await member?.roles.remove(Config.mutedRoleID);
        const timer = this.timers.get(mute);
        if (timer) this.client.clearTimeout(timer);
        channel.send(`${member?.user.tag} has been unmuted.`);
        Logger.debug(`${member?.user.tag} has been unmuted.`);
    }

    public StartTimer(mute: Mute): void {
        const milliseconds = moment(mute.dateEnd).diff(moment(), "milliseconds");
        Logger.debug(`Starting an Unmute Timer for ${milliseconds}ms`);
        const timer = this.client.setTimeout(() => this.Unmute(mute), milliseconds);
        this.timers.set(mute, timer);
    }

    public async Run(): Promise<void> {
        const mutes = await MuteModel.find({
            dateEnd: {
                $gt: new Date(),
            },
        });
        mutes.forEach((mute) => this.StartTimer(mute));
    }
}
