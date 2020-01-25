import Observer from "../Observer";
import { GuildMember } from "discord.js";

export default abstract class MessageObserver extends Observer<GuildMember> {
    get event(): string {
        return "guildMemberAdd";
    }

    public Check(_param: GuildMember): boolean {
        return true;
    }
}
