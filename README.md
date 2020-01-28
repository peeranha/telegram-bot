# Telegram Bot

This is a Telegram bot for Peeranha website written on Node.js as a AWS Lambda function.

## Setup
### Telegram
1. Go to Telegram.
1. Start a chat with `@BotFather`.
1. Type "/start".
1. Type "/newbot" to create a new bot.
1. Set name, description and photo for a bot.
1. Turn-off privacy mode for groups, so that bot can have access to others messages. 
   Type "/mybots" -> choose your bot -> Bot Settings -> Group Privacy -> Disable.

### Setting Webhooks
* A curl example for a verified certificate:  
  `curl -F “url=https://<YOURDOMAIN.EXAMPLE>:<PORT>/<WEBHOOKLOCATION>" https://api.telegram.org/bot<YOURTOKEN>/setWebhook`
* A curl example for a self-signed certificate:  
  `curl -F "url=https://<YOURDOMAIN.EXAMPLE>:<PORT>/<WEBHOOKLOCATION>" -F "certificate=@<YOURCERTIFICATE>.pem" https://api.telegram.org/bot<YOURTOKEN>/setWebhook`
* A curl example to clear a previous Webhook:  
  `curl -F "url=" https://api.telegram.org/bot<YOURTOKEN>/setWebhook`

For example: 
```
$ curl -F "url=https://b9u1g4c222.execute-api.us-east-1.amazonaws.com/dev/bot" https://api.telegram.org/bot777:AAA/setWebhook
$ {"ok":true,"result":true,"description":"Webhook was set"}
```

More details on Telegram [Webhook Documentation website](https://core.telegram.org/bots/webhooks).

### Deploy on AWS
1. Create .env file from example.env, specify keys.
2. Run:
    ```
    $ source .env
    $ sls deploy
    ```

### Monitor logs
```
sls logs -f -t bot
```

## How to develop locally?
```
sls offline start
```

## Telegram API
* [Incoming object format - "Update"](https://core.telegram.org/bots/api#update)
* [List of available methods](https://core.telegram.org/bots/api#available-methods)