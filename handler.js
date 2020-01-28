'use strict';

console.info('Loading bot function.');

let ready = true;
if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error(`Please, provide TELEGRAM_BOT_TOKEN env variable.`);
    ready = false;
}

const telegram = require("./telegram");

/**
 * Main Lambda function
 *
 * @param {object} event AWS Lambda event data.
 * @param {object} context runtime information of the Lambda function that is executing.
 *
 * @return {object} Request Promise
 */
module.exports.bot = async (event, context) => {
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
        await telegram.dispatcher(update);
    } catch (e) {
        console.error(`Something unpredictable happened:`, e);
        return {statusCode: 500};
    }

    return {statusCode: 200};
};
