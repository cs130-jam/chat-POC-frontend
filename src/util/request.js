function apiUrl(...paths) {
    return "http://localhost:8080/api/" + paths.join("/");
}

function withParams(url, params) {
    return url + "?" + new URLSearchParams(params);
}

export {apiUrl, withParams};