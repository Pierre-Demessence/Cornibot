import { Command, CommandInfo } from "discord.js-commando";
import DiscordBot from "./DiscordBot";

export default abstract class CorniCommand extends Command {
    public client!: DiscordBot;
    constructor(client: DiscordBot, info: CommandInfo) {
        super(client, info);
    }
}
