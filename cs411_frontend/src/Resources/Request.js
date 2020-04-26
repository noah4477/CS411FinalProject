const Cookies = require('js-cookie');
const axios = require('axios');
export function getRequest(url = '')
{
    var requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get('jwt')
          },
        redirect: 'follow'
      };
      
      return fetch(url, requestOptions)
}

export function postRequest(url = '', data = {})
{
    var requestOptions = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + Cookies.get('jwt'),
          },
        redirect: 'follow',
        body: JSON.stringify(data)
      };
      
     return fetch(url, requestOptions)

}