const TelegramBot = require('node-telegram-bot-api');

const { callService,
        SUBSCRIBETOCOMMUNITY_ADD_SERVICE, 
        SUBSCRIBETOCOMMUNITY_GET_SERVICE, 
        UNSUBSCRIBETOCOMMUNITY_ADD_SERVICE, 
        COMMUNITY_ADD_SERVICE, 
        COMMUNITIES_GET_SERVICE } = require("./aws-connector");


const Token = '1275969487:AAE_5s9X1mPJ4fyPw8ofq5WdW1n46XE3oPg';
const bot = new TelegramBot(Token, {polling: true});
                
bot.onText(/\/subscribe (.+)/, (msg,  [source, match]) => {               //subscribe
    const { id } = msg.chat;
    console.log(msg);
    subscribeToCommunity(id, match);
})

bot.onText(/\/unsubscribe (.+)/, (msg,  [source, match]) => {               //subscribe
    const { id } = msg.chat;
    console.log(msg);
    unSubscribeToCommunity(id, match);
})

bot.onText(/\/show/, msg =>{                    //show
    const { id } = msg.chat;
    console.log(msg);
    showCommunities(id);   
})

bot.onText(/\/myfollow/, msg =>{                    //myfollow
    const { id } = msg.chat;
    console.log(msg);
    myFollow(id);   
})

bot.onText(/\/addcom/, msg =>{               //addcom
    const { id } = msg.chat;
    console.log(msg);
    addCommunities(id);
})

const subscribeToCommunity = async (chatId, community) => {
    const response = await callService(SUBSCRIBETOCOMMUNITY_ADD_SERVICE, {
        community: community.toString(),
        user: chatId.toString(),
    }); 

    if (response.OK) {
        bot.sendMessage(chatId, "sub");
    } else {
        bot.sendMessage(chatId, "error: " + response.errorMessage );
    }
}

const unSubscribeToCommunity = async (chatId, community) => {
    const response = await callService(UNSUBSCRIBETOCOMMUNITY_ADD_SERVICE, {
        community: community.toString(),
        user: chatId.toString(),
    }); 

    if(response.errorMessage){
        bot.sendMessage(chatId, "error: " + response.errorMessage );
    } else {
        bot.sendMessage(chatId, "unSub");
    }
}

const addCommunities = async (chatId) => {
    var response = await callService(COMMUNITY_ADD_SERVICE, {
        name: 'community1',
        id: '1',
        description: 'description community1'
    }); 

    if(response.errorMessage){
        bot.sendMessage(chatId, "error: " + response.errorMessage);
    } else {
        bot.sendMessage(chatId, "Added community");
    }
    
    response = await callService(COMMUNITY_ADD_SERVICE, {
        name: 'community2',
        id: '2',
        description: 'description community2'
    });

    if(response.errorMessage){
        bot.sendMessage(chatId, "error: " + response.errorMessage);
    } else { 
        bot.sendMessage(chatId, "Added community");
    }
}

const showCommunities = async (chatId) => {
    const response = await callService(COMMUNITIES_GET_SERVICE, {}, true); 

    if(response.body.length) {
        const html = response.body.map((f,i) => {
            return `<b>${i + 1}</b>. ${f.name} ${f.description}`
        }).join('\n');
               
        bot.sendMessage(chatId, html, {
            parse_mode: 'HTML'
        });
    } else {
        bot.sendMessage(chatId, 'Communities not found');
    }   
}

const myFollow = async (chatId) => {
    const response = await callService(SUBSCRIBETOCOMMUNITY_GET_SERVICE, { user: chatId.toString() });

    if(response.body.length) {
        const html = response.body.map((f,i) => {
            return `<b>${i + 1}</b>. ${f.community}`
        }).join('\n');
                   
        bot.sendMessage(chatId, html, {
            parse_mode: 'HTML'
        }); 
    } else {
        bot.sendMessage(chatId, 'Communities not found');
    }   
}