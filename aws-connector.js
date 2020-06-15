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

module.exports = {
    callService,
    COMMUNITY_ADD_SERVICE,
    COMMUNITIES_GET_SERVICE,
    SUBSCRIBETOCOMMUNITY_ADD_SERVICE,
    SUBSCRIBETOCOMMUNITY_GET_SERVICE,
    UNSUBSCRIBETOCOMMUNITY_ADD_SERVICE,
};