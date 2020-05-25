import Parser from "rss-parser";
import moment from "moment";
import { TextChannel } from "discord.js";
import { sprintf } from "sprintf-js";

import Service from "../Engine/Service";
import Cornibot from "../Engine/CorniBot";
import Config, { FeedInfo } from "../Engine/Config";
import { Clamp } from "../Utils/Math";

export default class RSSParser extends Service {
    constructor(client: Cornibot) {
        super(client, {
            name: "rss_parser",
        });
    }

    private readonly MIN_CHECK_INTERVAL = 1000;
    private readonly MAX_CHECK_INTERVAL = 60000;
    private readonly DEFAULT_CHECK_INTERVAL = 30000;
    private readonly DEFAULT_MESSAGE_FORMAT = `**%(title)s**\n%(link)s`;

    private FormatFeedItem(item: Parser.Item, messageFormat: string): string {
        return sprintf(messageFormat || this.DEFAULT_MESSAGE_FORMAT, {
            title: item.title,
            link: item.link,
        });
    }

    private async WatchFeed(feedInfo: FeedInfo): Promise<void> {
        const parser = new Parser();

        let lastItemDate: moment.Moment | undefined = undefined;
        setInterval(async () => {
            const feed = await parser.parseURL(feedInfo.url);
            let last: moment.Moment | undefined = undefined;
            feed.items?.forEach((item) => {
                if (last === undefined || moment(item.pubDate).isAfter(last)) last = moment(item.pubDate);
                if (lastItemDate && moment(item.pubDate).isAfter(lastItemDate)) {
                    const channel = this.client.GetGuild().channels.resolve(feedInfo.channelID) as TextChannel;
                    channel.send(this.FormatFeedItem(item, feedInfo.messageFormat));
                }
            });
            lastItemDate = last;
        }, Clamp(feedInfo.checkInterval, this.MIN_CHECK_INTERVAL, this.MAX_CHECK_INTERVAL) || this.DEFAULT_CHECK_INTERVAL);
    }

    public async Run(): Promise<void> {
        Config.rssFeeds.filter((f) => f.enabled).forEach((feedInfo) => this.WatchFeed(feedInfo));
    }
}
