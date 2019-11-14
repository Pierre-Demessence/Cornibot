// tslint:disable-next-line: no-var-requires
const dialogflow = require("dialogflow");

import * as util from "util";
import * as uuid from "uuid";

// tslint:disable-next-line: interface-name
interface DialogFlowResult {
    answer: string;
    intent: string;
    params: {
        fields: {
            [field: string]: any,
        },
    };
}

export async function runSample(text: string, projectId = "le-schmilblick-app"): Promise<DialogFlowResult> {
    const sessionId = uuid.v4();

    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
        queryInput: {
            text: {
                languageCode: "en-US",
                text,
            },
        },
        session: sessionPath,
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    console.log(`Params: ${util.inspect(result.parameters, false, null)}`);
    return {
        answer: result.fulfillmentText,
        intent: result.intent.displayName,
        params: result.parameters,
    };
}
