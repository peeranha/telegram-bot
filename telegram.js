const axios = require('axios');


/**
 * Accept incoming notification from Telegram
 *
 * @param {object} Update Update Telegram Object <a href="https://core.telegram.org/bots/api#update">More</a>
 */
exports.dispatcher = async (Update) => {
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

    const response = `Hi there! You asked "${text}"\n`
        + `I don't know the answer, but you can check our website: https://peeranha.io/faq/`;

    await sendMessage(chatId, response);
}

/**
 * Send message to Telegram
 *
 * @param {int} chatId Chat ID
 * @param {string} text Message to send
 *
 * @return Promise Request Axios Promise
 */
function sendMessage(chatId, text) {
    return postCall(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
    });
}

/**
 * Helper method that makes POST calls to specified URL and passed body.
 *
 * @param url URL to make a POST call to.
 * @param data Optional payload information
 *
 * @returns Promise Axios promise
 */
function postCall(url, data) {
    return axios.post(url, data)
        .then(response => response.data)
        .catch(error => {
            if (error.response) {
                console.error(`Failed to make a call to Telegram API: `, error.response.data);
            } else if (error.request) {
                console.error(`The request was made but no response was received: `, error.request);
            } else {
                console.error(`Something happened in setting up the request`);
            }
        });
}