function q2l_setXp(xpValue) {
    var ifrm = document.getElementById("quest2l-iframe")

    ifrm.contentWindow.postMessage({"id": "DEBUG-setXp", "retValue": xpValue}, "*");
}