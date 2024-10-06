var BASE_URL = ""

function apiGet(callback, apiUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", BASE_URL + "/api/" + apiUrl, true);
    xmlHttp.send(null);

    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText)
        } else if (this.status != 200) {
            console.error(this)
        }
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function toggleContainer() {
    var x = document.getElementById("quest2l-container");
    if (x.style.visibility === "visible") {
        x.style.visibility = "hidden";
        x.style.opacity = "0";
        setCookie("q2l_state", "0", 7)

    } else {
        x.style.visibility = "visible";
        x.style.opacity = "1";
        setCookie("q2l_state", "1", 7)
    }
}

async function main() {
    // Determine if this is d2l
    // and get base url
    var path_array = window.location.pathname.split("/")

    while (path_array.length > 0) {
        var url = path_array.join("/") + "/api/versions/"

        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, false);
        xhttp.send();

        if (xhttp.status == 200) {
            BASE_URL = path_array.join("/");
            break;
        }

        path_array.pop()
    }

    if (BASE_URL == "") {
        // Not d2l
        return
    }

    console.log("Extension loaded")

    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL("src/styles/iframe.css");
    document.head.appendChild(link);

    var dragScript = document.createElement('script');
    dragScript.setAttribute('src',chrome.runtime.getURL("src/js/drag_box.js"));
    document.head.appendChild(dragScript);


    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", "about:blank");
    ifrm.id = "quest2l-iframe"

    var dragDiv = document.createElement("div");
    dragDiv.id = "quest2l-container-header"
    dragDiv.innerHTML = "Click here to move"

    var closeDiv = document.createElement("div");
    closeDiv.id = "quest2l-container-close"
    closeDiv.innerHTML = "X"
    closeDiv.addEventListener("click", toggleContainer)
    dragDiv.appendChild(closeDiv)

    var ifrmDiv = document.createElement("div");
    ifrmDiv.id = "quest2l-container"
    ifrmDiv.style = "visibility:hidden;opacity:0"
    ifrmDiv.appendChild(dragDiv)

    ifrmDiv.appendChild(ifrm)

    document.body.appendChild(ifrmDiv)
    ifrm.src = chrome.runtime.getURL("src/index.html")

    if (getCookie("q2l_state") == "") {
        setCookie("q2l_state", "0", 7)
    } else if (getCookie("q2l_state") == "1") {
        toggleContainer()
    }

}

function onMessage(event) {
    event.stopImmediatePropagation();
    if (!event.origin.startsWith("chrome-extension://")) {
        return;
    }

    var data = event.data;

    if (data.func == "apiGet") {
        apiGet(function(retValue) {
            var ifrm = document.getElementById("quest2l-iframe")

            ifrm.contentWindow.postMessage({"id": data.id, "retValue": retValue}, "*");
        }, data.args[0])
    }
}

window.addEventListener("message", onMessage, false);
main()

