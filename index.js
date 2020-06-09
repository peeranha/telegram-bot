const fetch = require("node-fetch");
const AWS = require('aws-sdk');
const TelegramBot = require('node-telegram-bot-api');
// const { callService, SUBCOMMUNITY_ADD_SERVICE, COMMUNITY_ADD_SERVICE, COMMUNITIES_GET_SERVICE } = require('./aws-connector');

const Token = '1275969487:AAE_5s9X1mPJ4fyPw8ofq5WdW1n46XE3oPg';
const bot = new TelegramBot(Token, {polling: true});
                
bot.onText(/\/subscribe (.+)/, (msg,  [source, match]) => {               //subscribe
    const { id } = msg.chat;
    subscribeToCommunity(id, match);
})

bot.onText(/\/unsubscribe (.+)/, (msg,  [source, match]) => {               //subscribe
    const { id } = msg.chat;
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
    addCommunities(id);
})

const subscribeToCommunity = async (chatId, name) => {
    console.log(name)
    const response = await callService(SUBSCRIBETOCOMMUNITY_ADD_SERVICE, {
        community: name.toString(),
        user: chatId.toString(),
    }); 

    if (response.OK) {
        bot.sendMessage(chatId, "sub");
    } else {
        bot.sendMessage(chatId, "error: " + response.errorMessage );
    }
}

const unSubscribeToCommunity = async (chatId, Name) => {
    console.log(Name);
    const response = await callService(UNSUBSCRIBETOCOMMUNITY_ADD_SERVICE, {
        community: Name.toString(),
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
    console.log(chatId.toString());
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
    console.log(chatId.toString());
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

const COMMUNITY_ADD_SERVICE = 'community/add';
const COMMUNITIES_GET_SERVICE = 'communities/get';
const SUBSCRIBETOCOMMUNITY_ADD_SERVICE = 'subscribeToCommunity/add';
const SUBSCRIBETOCOMMUNITY_GET_SERVICE = 'subscribeToCommunity/get';
const UNSUBSCRIBETOCOMMUNITY_ADD_SERVICE = 'unSubscribeToCommunity/add';

async function callService(service, props, isGet = false) {
    try{
        const url = new URL('http://localhost:3500/' + service);

        if (isGet) {
          url.search = new URLSearchParams(props).toString();
        }
      
        const rawResponse = await fetch(url, {
          method: isGet ? 'GET' : 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          ...(!isGet ? { body: JSON.stringify(props) } : {}),
        });
        const response = await rawResponse.json();
        if (rawResponse.status < 200 || rawResponse.status > 208) {
          return {
            errorMessage: response.message,
            errorCode: response.code,
          };
        }
        return {
          OK: true,
          body: response,
        };
    } catch (err) {
        console.log('Logger error: ', err.message);
    }
}