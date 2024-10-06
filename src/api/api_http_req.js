function apiGet(callback, apiUrl) {
    window.addEventListener("message", function(event) {
        if (event.data.id == apiUrl) {
            callback(event.data.retValue)
            event.stopImmediatePropagation();
        } else {
            console.error("Got wrong id: " + event.data.id + ", should be: " + apiUrl)
            window.addEventListener("message", this, { once: true })
        }
    }, { once: true });

    window.parent.postMessage({
        "func": "apiGet",
        "args": [apiUrl],
        "id": apiUrl
    }, "*")
}

function apiGetData(callback, apiUrl, data) {
    window.addEventListener("message", function(event) {
        if (event.data.id == apiUrl) {
            callback(event.data.retValue, data)
            event.stopImmediatePropagation();
        } else {
            console.error("Got wrong id: " + event.data.id + ", should be: " + apiUrl)
            window.addEventListener("message", this, { once: true })
        }
    }, { once: true });

    window.parent.postMessage({
        "func": "apiGet",
        "args": [apiUrl],
        "id": apiUrl
    }, "*")
}

function hash(string) {
    var hash = 0,
    i, chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}