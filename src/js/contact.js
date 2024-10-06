function main() {
    apiGet(whoami_callback, "lp/1.47/users/whoami")
}

function whoami_callback(jsonString) {
    var json = parseApi(jsonString)

    document.getElementById("mruName").innerHTML = getFullName(json)
}

var apiReqScript = document.createElement('script');
apiReqScript.src = "../api/api_http_req.js"
document.head.appendChild(apiReqScript);

var apiConvScript = document.createElement('script');
apiConvScript.src = "../api/api_converter.js"
document.head.appendChild(apiConvScript);


window.onload = function() {
    main()
};

