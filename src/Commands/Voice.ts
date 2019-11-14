import * as Discord from "discord.js";
import { Readable } from "stream";

import ACommand from "../ACommand";
import * as DialogFlowModule from "../Modules/DialogFlowModule";
import * as SpeechToTextModule from "../Modules/SpeechToTextModule";
import * as TextToSpeechModule from "../Modules/TextToSpeechModule";

export default class VoiceCommand extends ACommand {
    public Args: boolean = false;
    public Cooldown: number = 5;
    public Description: string = "Voice!";
    public Name: string = "vc";

    public async Run(msg: Discord.Message, _argsA: any[] | undefined, _argsO: { [key: string]: any } | undefined): Promise<string> {
        if (!msg.member?.voice.channel) return Promise.resolve("You need to join a voice channel first!");
        try {
            const connection = await msg.member.voice.channel.join();
            const stdin = process.openStdin();
            stdin.addListener("data", async (d) => {
                const text = d.toString().trim();
                // const answer = await DialogFlowModule.runSample(text);
                const response = await TextToSpeechModule.TTS(text);
                /*
                const readable = new Readable();
                readable._read = () => {};
                readable.push(response.audioContent);
                readable.push(null);
                connection.playConvertedStream(readable);
                */
                connection.play("output.mp3", {
                    bitrate: 32000,
                });
            });
            /*
            const receiver = connection.createReceiver();
            connection.on("speaking", (user, speaking) => {
                if (!speaking) {
                    console.log(`I stopped listening to ${user.username}`);
                    return;
                }
                console.log(`I'm listening to ${user.username}`);

                const audioStream = receiver.createPCMStream(user);
                SpeechModule.Transcript(audioStream)
                    .then((transcription) => {
                        console.log(`Transcription: ${transcription}`);
                    });
            });
            */
            return Promise.resolve("I have successfully connected to the channel!");
        } catch (error) {
            return await Promise.reject(error);
        }
    }
}
