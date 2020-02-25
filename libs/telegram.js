import axios from "axios";

/**
 * Send message to Telegram
 *
 * @param {int} chatId Chat ID
 * @param {string} text Message to send
 *
 * @return Promise Request Promise
 */
export const sendMessage = async (chatId, text) => {
    return postCall(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
    });
};

/**
 * Helper method that makes POST calls to specified URL and passed body.
 *
 * @param url URL to make a POST call to.
 * @param data Optional payload information
 *
 * @returns Promise Axios promise
 */
export const postCall = async (url, data) => {
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
};
