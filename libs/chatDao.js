// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

export function getChat(chatId) {
    return docClient.get({
        TableName: 'subscribers',
        Key: {
            'chatId': chatId
        },
    }).promise();
}

export function updateChat(chatId, communityIds) {
    return docClient.update({
        TableName: 'subscribers',
        Key: {chatId: chatId},
        ReturnValues: 'ALL_NEW',
        UpdateExpression: "set communityIds = :ids",
        ExpressionAttributeValues: {
            ":ids": communityIds
        }
    }).promise();
}

export function createChat(chatId, communityIds) {
    return docClient.put({
        TableName: 'subscribers',
        Item: {
            'chatId': chatId,
            'communityIds': communityIds
        }
    }).promise();
}


export function findSubscribers(data) {
    const params = {
        TableName: 'subscribers',
        // TODO add filtering logic
        // ProjectionExpression: 'chatId',
        // FilterExpression: 'topic = :topic',
        // ExpressionAttributeValues: {':topic': someTopic}
    };

    return docClient.scan(params).promise();
}
