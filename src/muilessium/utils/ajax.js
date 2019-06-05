// -----------------------------------------------------------------------------
// Ajax utilities
// -----------------------------------------------------------------------------


import console from '../utils/console';


// Post
// ----
// Makes a POST request and executes a success or error callback when
// the request state changes

function post(url, data, successCallback, errorCallback) {
    const request = new XMLHttpRequest();

    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            /* Only 2xx codes are successful for the POST request. */
            if ((request.status >= 200) && (request.status < 300)) {
                successCallback(request.responseText);
            } else {
                console.error(`POST (${url}): error ${request.status} ${request.statusText}`);
                errorCallback(request.status, request.statusText);
            }
        }
    };

    request.send(data);
}



// Protected post
// --------------
// Makes a POST request and executes a callback if it was success
// and tries to repeat request otherwise

function postProtected(url, data, callback) {
    post(url, data, callback, () => {
        setTimeout(
            postProtected.bind(null, url, data, callback),
            1500
        );
    });
}



// Get
// ---
// Makes a GET request and executes a success or error callback when
// the request state changes

function get(url, successCallback, errorCallback) {
    const request = new XMLHttpRequest();

    request.open('GET', url, true);

    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            /* Status 304 (Not Modified) is also a successful for the GET request. */
            if (((request.status >= 200) && (request.status < 300)) || (request.status === 304)) {
                successCallback(request.responseText);
            } else {
                console.error(`GET (${url}): error ${request.status} ${request.statusText}`);
                errorCallback(request.status, request.statusText);
            }
        }
    };

    request.send(null);
}



// Protected get
// --------------
// Makes a GET request and executes a callback if it was success
// and tries to repeat request otherwise

function getProtected(url, callback) {
    get(url, callback, () => {
        setTimeout(
            getProtected.bind(null, url, callback),
            1500
        );
    });
}


// -----------------------------------------------------------------------------


const ajax = {
    post,
    postProtected,
    get,
    getProtected
};

export default ajax;

