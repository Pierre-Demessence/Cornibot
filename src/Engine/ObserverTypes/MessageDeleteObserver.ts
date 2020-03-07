import { Message } from "discord.js";
import Observer from "../Observer";
export default abstract class MessageDeleteObserver extends Observer<Message> {
    get event(): string {
        return "messageDelete";
    }
    public Check(_param: Message): boolean {
        return true;
    }
}
