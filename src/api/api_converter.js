function parseApi(jsonString) {
    return JSON.parse(jsonString);
}

// whoami

function getUserId(json) {
    return json.Identifier
}

function getFirstName(json) {
    return json.FirstName
}

function getLastName(json) {
    return json.LastName
}

function getUserUniqueName(json) {
    return json.UniqueName
}

function getFullName(json) {
    return getFirstName(json) + " " + getLastName(json)
}

// myenrollments

function getClassList(json) {
    var classList = []

    for (var i = 0; i < json.length; i++) {
        // if (json[i]["Access"]["StartDate"] != null) {
        //     classList.push([json[i]["OrgUnit"]["Id"], json[i]["OrgUnit"]["Name"], json[i]["OrgUnit"]["HomeUrl"]])
        // }

        classList.push([json[i]["OrgUnit"]["Id"], json[i]["OrgUnit"]["Name"], json[i]["OrgUnit"]["HomeUrl"]])

    }

    return classList
}