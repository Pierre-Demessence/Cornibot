/* eslint-disable @typescript-eslint/no-explicit-any */
import Transport from "winston-transport";
import DiscordBot from "./DiscordBot";
import { TextChannel, MessageEmbed } from "discord.js";

export default class DiscordTransport extends Transport {
    private client: DiscordBot;
    private ready = false;

    constructor(client: DiscordBot, opts?: Transport.TransportStreamOptions) {
        super(opts);
        this.client = client;
        this.client.on("ready", () => (this.ready = true));
    }

    public log?(info: any, next: () => void): any {
        if (!this.ready) return next();
        const channel = this.client.GetGuild().channels.get("528725118382374912") as TextChannel;
        channel.send(
            new MessageEmbed()
                .setDescription(info.message)
                .setTimestamp(new Date(info.timestamp).getTime())
                .setFooter(info.level)
        );
        next();
    }
}
