function main() {
    apiGet(whoami_callback, "lp/1.47/users/whoami")
    apiGet(myenrollments_callback, "lp/1.47/enrollments/myenrollments/?orgUnitTypeId=3&isActive=true&canAccess=true");
}

function whoami_callback(jsonString) {
    var json = parseApi(jsonString);
    document.getElementById("mruName").innerHTML = getFullName(json);
}

function myenrollments_callback(jsonString) {
    var json = parseApi(jsonString)["Items"];
    var classList = getClassList(json);

    // Loop over the class list
    for (let i = 0; i < classList.length; i++) {
        let classId = classList[i][0];  // Use `let` to keep scope within this iteration
        let className = classList[i][1];

        console.log(className + " " + classId);
        
        // Fetch class-specific data
        apiGet(quests_callback, `le/1.47/${classId}/calendar/events/`);
    }
}

function quests_callback(jsonString) {
    var json = parseApi(jsonString);
    let taskTitles = [];

    // Assuming json contains a task array
    if (json && json.length > 0) {
        for (let i = 0; i < 4; i++) {
            var taskTitle = json[i].Title;
            console.log(taskTitle);

            if ((taskTitle != undefined || taskTitle != null) && !taskTitles.includes(taskTitle)) {
                taskTitles.push(taskTitle);
            } 

            var li = document.createElement('li')
            li.appendChild(document.createTextNode(taskTitles[i]))
            document.getElementById("quests").appendChild(li)
        }

    }
}

var apiReqScript = document.createElement('script');
apiReqScript.src = "../api/api_http_req.js";
document.head.appendChild(apiReqScript);

var apiConvScript = document.createElement('script');
apiConvScript.src = "../api/api_converter.js";
document.head.appendChild(apiConvScript);

window.onload = function() {
    main();
};
