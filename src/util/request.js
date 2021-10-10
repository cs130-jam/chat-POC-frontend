function apiUrl(...paths) {
    return "http://54.215.93.36:8080/api/" + paths.join("/");
}

function withParams(url, params) {
    return url + "?" + new URLSearchParams(params);
}

export {apiUrl, withParams};