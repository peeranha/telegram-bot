import AWS from "aws-sdk";
import {sendMessage} from "../../libs/telegram";

console.info('Loading bot function.');

let ready = true;
if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error(`Please, provide TELEGRAM_BOT_TOKEN env variable.`);
    ready = false;
}

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1"
});

/**
 * Main Lambda function
 *
 * @param {object} event AWS Lambda event data.
 * @param {object} context runtime information of the Lambda function that is executing.
 *
 * @return {object} Request Promise
 */
export const bot = async (event, context) => {
    console.info(`Incoming event: \n ${JSON.stringify(event.body, null, 2)}`);

    if (!ready) {
        console.log(`Check you Lambda configuration.`);
        return {statusCode: 500};
    }

    if (!event.body) {
        console.warn("No body payload is provided.");
        return {statusCode: 400};
    }

    try {
        const update = JSON.parse(event.body);
        console.info(`Incoming Telegram Update: ${JSON.stringify(update, null, 2)}`);
        await dispatcher(update);
    } catch (e) {
        console.error(`Something unpredictable happened:`, e);
        return {statusCode: 500};
    }

    return {statusCode: 200};
};


/**
 * Accept incoming notification from Telegram
 *
 * @param {object} Update Update Telegram Object <a href="https://core.telegram.org/bots/api#update">More</a>
 */
export const dispatcher = async (Update) => {
    if (Update.message) { // New incoming message of any kind — text, photo, sticker, etc.
        console.info(`New incoming message.`);
        await handleMessage(Update.message);
    } else {
        console.warn(`Not yet supported update notification.`);
    }
};

/**
 * Handle new message from Telegram
 *
 * @param {object} Message <a href="https://core.telegram.org/bots/api#message">Message</a> object from Telegram.
 */
async function handleMessage(Message) {
    const chatId = Message.chat.id;
    const text = Message.text;
    const firstName = Message.from.first_name;

    const response = `Hi ${firstName}! You asked "${text}"\n`
        + `I don't know the answer, but you can check our website: https://peeranha.io/faq/\n`
        + `Your chat ID: ${chatId}, userId: ${Message.from.id}`;

    const existingChat = await docClient.get({
        TableName: "subscribers",
        Key: {
            'chatId': chatId
        },
    }).promise();

    console.info(`existingChat: \n ${JSON.stringify(existingChat, null, 2)}`);

    if (!existingChat.Item) {
        await docClient.put({
            TableName: "subscribers",
            Item: {
                "chatId": chatId,
                "initiatorId": Message.from.id,
                "command": Message.text
            }
        }).promise();
    }

    await sendMessage(chatId, response);
}
