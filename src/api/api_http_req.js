function apiGet(callback, apiUrl) {
    var id = hashCode(apiUrl)
    window.addEventListener("message", function eventHandler(event) {
        if (event.data.id == id) {
            // console.log("Event " + id + " ran")
            event.stopImmediatePropagation();
            callback(event.data.retValue)
            this.removeEventListener('message', eventHandler);

        } else {
            // console.error("Event got wrong id: " + event.data.id + ", should be: " + id)
        }
    });

    window.parent.postMessage({
        "func": "apiGet",
        "args": [apiUrl],
        "id": id
    }, "*")
}

function apiGetData(callback, apiUrl, data) {
    var id = hashCode(apiUrl)
    window.addEventListener("message", function eventHandler(event) {
        if (event.data.id == id) {
            // console.log("Event " + id + " ran")
            event.stopImmediatePropagation();
            callback(event.data.retValue, data)
            this.removeEventListener('message', eventHandler);

        } else {
            // console.error("Event got wrong id: " + event.data.id + ", should be: " + id)
        }
    });

    window.parent.postMessage({
        "func": "apiGet",
        "args": [apiUrl],
        "id": id
    }, "*")
}

function hashCode(string) {
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