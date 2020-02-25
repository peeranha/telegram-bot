import {sendMessage} from '../../libs/telegram';
import {createChat, updateChat} from "../../libs/chatDao";

let ready = true;
if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error(`Please, provide TELEGRAM_BOT_TOKEN env variable.`);
    ready = false;
}

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
        console.warn('No body payload is provided.');
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
 * @param {object} Update Update Telegram Object <a href='https://core.telegram.org/bots/api#update'>More</a>
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
 * @param {object} Message <a href='https://core.telegram.org/bots/api#message'>Message</a> object from Telegram.
 */
async function handleMessage(Message) {
    const chatId = Message.chat.id;
    const text = Message.text;
    const firstName = Message.from.first_name;

    // It's a command
    if (text.charAt(0) === '/') {
        if (text.startsWith('/subscribe ')) {
            const communityId = parseInt(text.substring(11));
            await subscribeToCommunity(chatId, communityId);
            await sendMessage(chatId, `You're subscribed to ${communityId}!`);
        }
        if (text.startsWith('/unsubscribe ')) {
            const communityId = parseInt(text.substring(12));
            await unsubscribeFromCommunity(chatId, communityId);
            await sendMessage(chatId, `You're unsubscribed from ${communityId}!`);
        }
    } else {
        const response = `Hi ${firstName}! You asked '${text}'\n`
            + `I don't know the answer, but you can check our website: https://peeranha.io/faq/\n`
            + `Your chat ID: ${chatId}, userId: ${Message.from.id}`;
        await sendMessage(chatId, response);
    }
}

async function subscribeToCommunity(chatId, communityId) {
    const existingChatRes = getChat(chatId);
    const existingChat = existingChatRes.Item;
    console.info(`existingChat: \n ${JSON.stringify(existingChat, null, 2)}`);

    let promise;
    if (existingChat) {
        const newSet = new Set(existingChat.communityIds);
        newSet.add(communityId);
        promise = updateChat(Array.from(newSet));
    } else {
        promise = createChat(chatId, [communityId])
    }
    return promise;
}

async function unsubscribeFromCommunity(chatId, communityId) {
    const existingChatRes = getChat(chatId);
    const existingChat = existingChatRes.Item;
    let promise = Promise.resolve();
    if (existingChat) {
        const newSet = new Set(existingChat.communityIds);
        newSet.delete(communityId);
        promise = updateChat(Array.from(newSet));
    }
    return promise;
}
