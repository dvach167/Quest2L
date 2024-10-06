function apiGet(callback, apiUrl) {
    window.parent.postMessage({
        "func": "apiGet",
        "args": [apiUrl]
    }, "*")

    window.addEventListener("message", function(event) {
        callback(event.data.retValue)
        event.stopImmediatePropagation();
    }, { once: true });
}

function apiGetData(callback, apiUrl, data) {
    window.parent.postMessage({
        "func": "apiGet",
        "args": [apiUrl]
    }, "*")

    window.addEventListener("message", function(event) {
        callback(event.data.retValue, data)
        event.stopImmediatePropagation();
    }, { once: true });
}