import AWS from "aws-sdk";
import {sendMessage} from '../../libs/telegram';

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
export const listener = async (event, context) => {
    console.info(`Incoming event: \n ${JSON.stringify(event.Records, null, 2)}`);

    for (let i = 0; i < event.Records.length; i++) {
        const messageStr = event.Records[i].Sns.Message;
        console.info(`Message received from SNS: \n ${JSON.stringify(messageStr, null, 2)}`);

        let messageObj;
        try {
            messageObj = JSON.parse(messageStr);
        } catch (e) {
            console.error("Message is not in JSON format");
            continue;
        }

        // Find subscribed telegram channels from dynamoDB
        console.info(`Querying DynamoDB...`);
        const res = await findSubscribers(messageObj);

        console.info(`Iterating over results from DynamoDB: \n ${JSON.stringify(res, null, 2)}`);
        for (let j = 0; j < res.Items.length; j++) {
            const chatId = res.Items[j].chatId;

            await sendMessage(chatId, "Content");
        }
    }

    return {statusCode: 200};
};

async function findSubscribers(data) {
    const params = {
        TableName: 'subscribers',
        // ProjectionExpression: 'chatId',
        // FilterExpression: 'topic = :topic',
        // ExpressionAttributeValues: {":topic": someTopic}
    };

    await docClient.put({
        TableName: "subscribers",
        Item: {
            "uuid": "123-1231-1313-1231",
            "chatId": "Put here!",
            "data": data
        }
    }).promise();

    return docClient.scan(params).promise();
}
