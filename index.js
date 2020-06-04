const fetch = require("node-fetch");
const AWS = require('aws-sdk');
const TelegramBot = require('node-telegram-bot-api');
// const { callService, SUBCOMMUNITY_ADD_SERVICE, COMMUNITY_ADD_SERVICE, COMMUNITIES_GET_SERVICE } = require('./aws-connector');

const Token = '1275969487:AAE_5s9X1mPJ4fyPw8ofq5WdW1n46XE3oPg';
const bot = new TelegramBot(Token, {polling: true});
                
bot.onText(/\/subscribe (.+)/, (msg,  [source, match]) =>{               //subscribe
    const {id} = msg.chat
    subscribeToCommunity(id, match);
})

bot.onText(/\/show/, msg =>{                    //show
    const {id} = msg.chat
    console.log(msg)
    showCommunities(id);   
})

bot.onText(/\/unsubscribe/, msg =>{               //subscribe
    const {id} = msg.chat
    const communityName = msg.text
    unSubscribeToCommunity(id, communityName);
})

async function subscribeToCommunity(chatId, Name){
    console.log(Name)
    let propsJson = JSON.stringify({
        community: Name.toString(),
        user: chatId.toString(),
    }); 
    var print = await callService(SUBCOMMUNITY_ADD_SERVICE, propsJson); 
    if(print.errorMessage != null){
        bot.sendMessage(chatId, "error: " + print.errorMessage );
    }
    else{bot.sendMessage(chatId, "sub");}
}

async function unSubscribeToCommunity(chatId, communityId){
    let propsJson = JSON.stringify({
        communityName: 'community1',
        communityId: '1',
        description: 'description community1'
    }); 
    var print = await callService(COMMUNITY_ADD_SERVICE, propsJson); 
    if(print.errorMessage != null){
        bot.sendMessage(chatId, "error: " + print.errorMessage );
    }
    else{bot.sendMessage(chatId, "added community");}
    
    let propsJson2 = JSON.stringify({
        communityName: 'community2',
        communityId: '2',
        description: 'description community2'
    }); 
    var print = await callService(COMMUNITY_ADD_SERVICE, propsJson2);
    if(print.errorMessage != null){
        bot.sendMessage(chatId, "error: " + print.errorMessage );
    }
    else{bot.sendMessage(chatId, "added community");}
}

async function showCommunities(chatId){
    let propsJson = JSON.stringify({}); 
    var print = await callService(COMMUNITIES_GET_SERVICE, propsJson, true); 

    if(!print.body.length) {
        bot.sendMessage(chatId, 'communities not found')
        return;
    };

    const html = print.body.map((f,i) => {
        return `<b>${i + 1}</b>. ${f.communityName} ${f.description}`
    }).join('\n')
           
    bot.sendMessage(chatId, html, {
        parse_mode: 'HTML'
    })  
}





const COMMUNITY_ADD_SERVICE = 'community/add';
const COMMUNITIES_GET_SERVICE = 'communities/get';
const SUBCOMMUNITY_ADD_SERVICE = 'subcommunity/add';

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