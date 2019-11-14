// tslint:disable-next-line: no-var-requires
const speech = require("@google-cloud/speech");

import { Readable } from "stream";

import ConvertTo1ChannelStream from "../ConvertTo1ChannelStream";

const speechClient = new speech.SpeechClient();

export function Transcript(audioStream: Readable): Promise<string> {
    return new Promise((res, rej) => {
        const requestConfig = {
            encoding: "LINEAR16",
            languageCode: "en-US",
            sampleRateHertz: 48000,
        };
        const request = {
            config: requestConfig,
        };
        const recognizeStream = speechClient
            .streamingRecognize(request)
            .on("error", console.error)
            .on("data", (response: { results: any[]; }) => {
                const transcription = response.results
                    .map((result: { alternatives: Array<{ transcript: any; }>; }) => result.alternatives[0].transcript)
                    .join("\n")
                    .toLowerCase();
                res(transcription);
            });

        const convertTo1ChannelStream = new ConvertTo1ChannelStream();

        audioStream.pipe(convertTo1ChannelStream).pipe(recognizeStream);
    });
}
