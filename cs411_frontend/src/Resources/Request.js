export function getRequest(url = '')
{
    var requestOptions = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
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
            'Content-Type': 'application/json'
          },
        redirect: 'follow',
        body: JSON.stringify(data)
      };
      
     return fetch(url, requestOptions)
}