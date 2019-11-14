import textToSpeech, { SynthesizeSpeechResponse } from "@google-cloud/text-to-speech";
import * as fs from "fs";
import * as util from "util";

const ttsClient = new textToSpeech.TextToSpeechClient();

export async function TTS(text: string): Promise<SynthesizeSpeechResponse> {
    const [response] = await ttsClient.synthesizeSpeech({
        audioConfig: { audioEncoding: "MP3" },
        input: { text },
        voice: {
            languageCode: "en-US",
            ssmlGender: "MALE",
        },
    });
    const writeFile = util.promisify(fs.writeFile);
    await writeFile("output.mp3", response.audioContent, "binary");
    return response;
}
