import path from "path";
import fetch from "node-fetch";
import { Canvas } from "canvas-constructor";
import { CommandoMessage } from "discord.js-commando";
import { Message, GuildMember, MessageAttachment } from "discord.js";

import CorniCommand from "../../Engine/CorniCommand";
import Cornibot from "../../Engine/CorniBot";
import User from "../../Models/User";

export default class ProfileCommand extends CorniCommand {
    constructor(client: Cornibot) {
        super(client, {
            name: "profile",
            aliases: [],
            group: "general",
            memberName: "profile",
            description: "See the profile card of a user.",
            examples: ["profile", "profile @Crawl#3208", "profile Crawl"],
            guildOnly: true,

            args: [
                {
                    key: "member",
                    label: "user",
                    prompt: "What user would you like see the profile card of?",
                    type: "member",
                    default: (msg: CommandoMessage): GuildMember => msg.member,
                },
            ],
        });
    }

    async run2(msg: CommandoMessage, args: { member: GuildMember }): Promise<Message | Message[]> {
        const result = await fetch(args.member.user.displayAvatarURL({ format: "png", size: 128 }));
        if (!result.ok) throw new Error("Failed to get the avatar.");
        const avatar = await result.buffer();

        const user = await User.findOne({ _id: args.member.id });
        if (!user) throw new Error("User does not exist.");

        Canvas.registerFont(path.resolve(path.join(__dirname, "../../../assets/fonts/Roboto-Black.ttf")), "Discord");
        const profileCard = new Canvas(400, 180)
            // Create the Blurple rectangle on the right side of the image.
            .setColor("#7289DA")
            .addRect(84, 0, 316, 180)
            .setColor("#2C2F33")
            .addRect(0, 0, 84, 180)
            .addRect(169, 26, 231, 46)
            .addRect(224, 108, 176, 46)
            // Create a shadow effect for the avatar placement.
            .setShadowColor("rgba(22, 22, 22, 1)") // This is a nice colour for a shadow.
            .setShadowOffsetY(5) // Drop the shadow by 5 pixels.
            .setShadowBlur(10) // Blur the shadow by 10.
            // This circle is 2 pixels smaller in the radius to prevent a pixel border.
            .addCircle(84, 90, 62)
            .addCircularImage(avatar, 84, 90, 64)
            //.addImage(avatar, 20, 26)
            // This creates a rounded corner rectangle, you must use save and restore to
            // clear the clip after we are done with it
            .save()
            .createBeveledClip(20, 138, 128, 32, 5)
            .setColor("#23272A")
            .fill()
            .restore()
            // Add all of the text for the template.
            // Let's center the text
            .setTextAlign("center")
            // I'm using a custom font, which I will show you how to add next.
            .setTextFont("10pt Discord")
            // Set the colour to white, since we have a dark background for all the text boxes.
            .setColor("#FFFFFF")
            // Add the name variable.
            .addText(args.member.displayName, 285, 54)
            // Using template literals, you can add text and variables, we're applying the toLocaleString()
            // to break up the number into a nice readable format.
            .addText(`Level: 42`, 84, 159)
            // Now we want to align the text to the left.
            .setTextAlign("left")
            // Let's add all the points!
            .addText(`Messages: ${user.get("nbMessages")}`, 241, 136)
            .toBuffer();

        return msg.say(new MessageAttachment(profileCard));
    }
}
