const fetchBase = (url, method = "GET", body) => {
    const requestOptions = {
        method: method,
        headers: {'Content-Type': 'application/json'},
    };

    if (method === "POST" || method === "PUT" || method === "PATCH") {
        requestOptions.body = body;
    }

    if (!url.startsWith("/")) url = "/" + url;

    return fetch(process.env.REACT_APP_SERVER_URL + url, requestOptions).then(resp => handleErrors(resp)).then(resp =>resp.json())
}
function handleErrors(response) {
    if (response.ok) return response;

    const responseError = {
        type: 'Error',
        status: response.status || 500,
        statusText: response.statusText || ''
    };

    const error = new Error();
    error.info = responseError;

    throw error;
}

export const getBase = (url) => {
    return fetchBase(url);
}

export const postBase = (url, body) => {
    if (body === undefined) throw Error("Cannot do a post with an empty body");
    return fetchBase(url, "POST", body);
}

export const patchBase = (url, body = {}) => {
    return fetchBase(url, "PATCH", body);
}

export default fetchBase
