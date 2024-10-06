function main() {
    apiGet(whoami_callback, "lp/1.47/users/whoami");
    apiGet(myenrollments_callback, "lp/1.47/enrollments/myenrollments/?orgUnitTypeId=3&isActive=true&canAccess=true");
}

function whoami_callback(jsonString) {
    var json = parseApi(jsonString);
    document.getElementById("mruName").innerHTML = getFullName(json);
}

function myenrollments_callback(jsonString) {
    var json = parseApi(jsonString)["Items"];
    var classList = getClassList(json);

    // Loop over the class list and fetch grades for each class
    for (let i = 0; i < classList.length; i++) {
        let classId = classList[i][0];
        let className = classList[i][1];

        console.log(className + " " + classId);

        // Fetch class-specific grade data
        apiGet((gradeJson) => quests_callback(gradeJson, classId), `le/1.47/${classId}/grades/`);
    }
}

function quests_callback(jsonString, classId) {
    var json = parseApi(jsonString);
    let taskTitles = [];

    if (json && Array.isArray(json)) {
        // Limit loop to avoid undefined values if json array is smaller than 4
        for (let i = 0; i < Math.min(4, json.length); i++) {
            let taskTitle = json[i].Name;
            let taskId = json[i].Id;

            // Ensures no duplicates in taskTitles
            if (taskTitle && !taskTitles.includes(taskTitle)) {
                taskTitles.push(taskTitle);
            }

            // Append each task to list in HTML
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(taskTitle));
            document.getElementById("quests").appendChild(li);
        }

        
        // Log grade identifiers for verification
        for (let i = 0; i < Math.min(4, json.length); i++) {
            if (json[0].GradeObjectIdentifier === taskTitles[i]) {
                var gradeExists = false;
                if (json[i].WeightedNumerator) {
                    gradeExists = true;
                }
            }
        }
       
    }
}

// Load API dependencies
var apiReqScript = document.createElement('script');
apiReqScript.src = "../api/api_http_req.js";
document.head.appendChild(apiReqScript);

var apiConvScript = document.createElement('script');
apiConvScript.src = "../api/api_converter.js";
document.head.appendChild(apiConvScript);

window.onload = function() {
    main();
};
