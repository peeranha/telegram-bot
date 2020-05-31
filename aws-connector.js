const COMMUNITY_ADD_SERVICE = 'community/add';
const COMMUNITIES_GET_SERVICE = 'communities/get';

async function callService(service, props, isGet = false) {
  // const url = new URL('http://localhost:3500/' + service);

  // if (isGet) {
  //   url.search = new URLSearchParams(props).toString();
  // }

  // const rawResponse = await fetch(url, {
  //   method: isGet ? 'GET' : 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   ...(!isGet ? { body: JSON.stringify(props) } : {}),
  // });
  // const response = await rawResponse.json();
  // if (rawResponse.status < 200 || rawResponse.status > 208) {
  //   return {
  //     errorMessage: response.message,
  //     errorCode: response.code,
  //   };
  // }
  // return {
  //   OK: true,
  //   body: response,
  // };
}