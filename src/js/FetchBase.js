const fetchBase = (url, method = "GET", body) => {
    const requestOptions = {
        method: method,
        headers: {'Content-Type': 'application/json'},
    };

    if (method === "POST" || method === "PUT") {
        requestOptions.body = body;
    }

    if (!url.startsWith("/")) url = "/" + url;

    return fetch(process.env.REACT_APP_SERVER_URL + url, requestOptions).then(resp => resp.json())
}

export const getBase = (url) => {
    return fetchBase(url);
}

export const postBase = (url, body) => {
    if (body == undefined) throw Error("Cannot do a post with an empty body");
    return fetchBase(url, "POST", body);
}

export default fetchBase
