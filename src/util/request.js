function apiUrl(...paths) {
    return "http://localhost/api/" + paths.join("/");
}

function withParams(url, params) {
    return url + "?" + new URLSearchParams(params);
}

export {apiUrl, withParams};