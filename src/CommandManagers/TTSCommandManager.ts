import * as Discord from "discord.js";

import ACommandManager from "../ACommandManager";
import * as DialogFlowModule from "../Modules/DialogFlowModule";
import * as TextToSpeechModule from "../Modules/TextToSpeechModule";

export default class TTSCommandManager extends ACommandManager {
    public async Parse(message: Discord.Message | Discord.PartialMessage): Promise<void> {
        if (!this.client.user || !message.content) return;
        if (!message.mentions?.users.array().includes(this.client.user)) return;

        let cleanedMessage: string = message.content;
        message.mentions.members?.forEach((member) => {
            cleanedMessage = cleanedMessage.replace(new RegExp(`<@!?${member.id}>`), member.displayName);
        });
        const result = await DialogFlowModule.runSample(cleanedMessage);

        let reply = result.answer;

        if (result.intent.startsWith("command.")) {
            const command = this.commandLoader.Get(result.intent.replace("command.", ""));
            if (command?.GuildOnly && message.channel?.type !== "text") {
                reply = "I can't execute that command inside DMs!";
            } else {
                try {
                    await command?.Run(message, undefined, result.params);
                } catch (err) {
                    reply = err.message;
                }
            }
        }

        console.log(reply);
        if (message.member?.voice.channel) {
            const connection = await message.member?.voice.channel.join();
            const audio = await TextToSpeechModule.TTS(reply);
            connection.play("output.mp3", {
                bitrate: 32000,
            });
        } else {
            message.reply?.(reply);
            (this.client.voice?.connections.forEach((c) => {
                if (c.channel.guild === message.guild) c.disconnect();
            }));
        }
    }

}
