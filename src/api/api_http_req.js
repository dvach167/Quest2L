function apiGet(callback, apiUrl) {
    window.parent.postMessage({
        "func": "apiGet",
        "args": [apiUrl]
    }, "*")

    window.addEventListener("message", function(event) {
        callback(event.data.retValue)
    }, false);

}