import { CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed } from "discord.js";

import CorniCommand from "../../Engine/CorniCommand";
import Cornibot from "../../Engine/CorniBot";
import Logger from "../../Utils/Logger";
import fetch from "node-fetch";

export default class WikipediaCommand extends CorniCommand {
    constructor(client: Cornibot) {
        super(client, {
            memberName: "wiki",
            group: "general",
            name: "wiki",
            description: "Gets a quick wikipedia tldr; on a subject",
            examples: ["wiki alan turing", "wiki docking"],
            guildOnly: true,
            args: [
                {
                    key: "query",
                    label: "query",
                    prompt: "What is your search query?",
                    type: "string",
                },
            ],
        });
    }

    async run2(msg: CommandoMessage, args: { query: string }): Promise<Message | Message[]> {
        try {
            const searchString =
                "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|info&generator=prefixsearch&redirects=1&converttitles=1&utf8=1&formatversion=2&exchars=750&exintro=1&explaintext=1&exsectionformat=plain&inprop=url&gpslimit=5&gpsprofile=fuzzy&gpssearch=";
            const data = await fetch(searchString + args["query"]);

            const json = await data.json();

            if (json["query"] == null) {
                return msg.reply("Topic not found.");
            }

            // Find best match (result with highest index)
            const pages = json["query"]["pages"].sort(function (page1: { [x: string]: number }, page2: { [x: string]: number }) {
                return page1["index"] - page2["index"];
            });

            if (pages[0]["extract"].includes("may refer to:")) {
                // Multiple
                const embed = new MessageEmbed().setTitle("Wikipedia | " + pages[0]["title"]).setURL(pages[0]["fullurl"]);

                // Build list
                let desc = "This may refer to:\n";
                for (let i = 1; i < pages.length; i++) {
                    desc += "- " + pages[i]["title"] + "\n";
                }
                embed.setDescription(desc);

                return msg.say(embed);
            } else {
                //Single
                return msg.say(
                    new MessageEmbed()
                        .setTitle("Wikipedia | " + pages[0]["title"])
                        .setURL(pages[0]["fullurl"])
                        .setDescription(pages[0]["extract"])
                );
            }
        } catch (err) {
            Logger.error("Error:", err);
            return msg.reply("Something went wrong connecting to wikipedia... Try again later");
        }
    }
}
