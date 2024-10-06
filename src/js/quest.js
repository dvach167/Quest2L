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
        apiGetData(quests_callback, `le/1.47/${classId}/grades/`, [classId, className]);

    }
}

function quests_callback(jsonString, data) {
    var json = parseApi(jsonString);
    var classId = data[0]
    var className = data[1]
    let taskTitles = [];

    if (json && Array.isArray(json)) {

        apiGetData(function(jsonString, data) {
            var json = parseApi(jsonString);
            var availableGrades = data[0]
            var className = data[1]
            var count = 0

            for (var i = 0; i < availableGrades.length; i++) {
                if (count > 4) {
                    break
                }
                if (availableGrades[i]["GradeType"] != "Numeric" ||
                    availableGrades[i]["AssociatedTool"] == null
                ) {
                    continue
                }
                var gradeCompleted = false

                for (var j = 0; j < json.length; j++) {
                    if (availableGrades[i]["Id"] == json[j]["GradeObjectIdentifier"]) {
                        console.log(parseFloat(json[j]["PointsNumerator"]))
                        if (parseFloat(json[j]["PointsNumerator"]) > 0.0) {
                            gradeCompleted = true
                        }
                        break
                    }
                }

                var li = document.createElement('li');
                li.innerHTML = availableGrades[i]["Name"]

                if (gradeCompleted) {
                    var img = document.createElement("img")
                    img.src = "../Resources/Check Mark.png"
                    li.appendChild(img)
                    document.getElementById("quests-completed").appendChild(li);
                } else {
                    document.getElementById("quests").appendChild(li);
                }

                li.innerHTML += "<br>(" + className + ")"

                count++

            }


        }, `le/1.47/${classId}/grades/values/myGradeValues/`, [json, className]);
       
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
