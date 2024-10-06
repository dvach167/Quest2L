var TOTAL_GRADE = 0.0
var TOTAL_GRADE_MAX = 0.0
var TOTAL_GRADE_COUNT = 0

var AVATAR_MAP = [[0, "peasant.png"], [20, "farmer.png"], [40, "baseknight.png"], [60, "kingsguard.png"], [70, "Level 70 Knight.png"], [85, "godknight.png"]]

function main() {
    apiGet(whoami_callback, "lp/1.47/users/whoami")
    apiGet(myenrollments_callback, "lp/1.47/enrollments/myenrollments/?orgUnitTypeId=3&isActive=true&canAccess=true&sortBy=-StartDate")

    debugReceive(function(xpValue) {
        TOTAL_GRADE = xpValue
        TOTAL_GRADE_MAX = 100
        updateXP()
    }, "DEBUG-setXp")

}

function whoami_callback(jsonString) {
    var json = parseApi(jsonString)

    document.getElementById("mruName").innerHTML = getFullName(json)
}

function myenrollments_callback(jsonString) {
    var classGrid = document.getElementById("classGrid")

    var json = parseApi(jsonString)["Items"]

    var classList = getClassList(json)

    var totalGrade = 0

    for (var i = 0; i < classList.length; i++) {
        var classId = classList[i][0]
        var className = classList[i][1]

        var li = document.createElement('li');

        apiGetData(function(jsonString, data) {
            var json = parseApi(jsonString)
            var num = 0.0
            var den = 0.0
            var li = data[0]
            var classId = data[1]

            for (var i = 0; i < json.length; i++) {
                if (json[i]["GradeObjectTypeName"] != "Numeric") {
                    continue
                }

                if (json[i]["WeightedNumerator"]) {
                    num += parseFloat(json[i]["WeightedNumerator"])
                    den += parseFloat(json[i]["WeightedDenominator"])
                } else {
                    num += parseFloat(json[i]["PointsNumerator"])
                    den += parseFloat(json[i]["PointsDenominator"])
                }
            }

            var grade = (num / den) * 100

            if (grade > 85.0) {
                li.classList.add("classGrid-green");
            } else if (grade > 60.0) {
                li.classList.add("classGrid-yellow");
            } else if (grade > 0.0) {
                li.classList.add("classGrid-red");
            }

            apiGetData(function(jsonString, data) {
                var json = parseApi(jsonString)
                var myGrades = data[0]

                for (var i = 0; i < json.length; i++) {
                    var max_grade = parseFloat(json[i]["Weight"])
                    var grade = 0.0

                    for (var j = 0; j < myGrades.length; j++) {
                        if (myGrades[j]["GradeObjectTypeName"] != "Numeric") {
                            continue
                        }

                        if (myGrades[j]["GradeObjectIdentifier"] == json[i]["Id"]) {
                            // console.log(myGrades[j]["GradeObjectName"])
                            grade = (parseFloat(myGrades[j]["PointsNumerator"]) / parseFloat(myGrades[j]["PointsDenominator"])) * parseFloat(json[i]["Weight"])
                            break
                        }

                    }
                    TOTAL_GRADE += grade
                    TOTAL_GRADE_MAX += max_grade
                    TOTAL_GRADE_COUNT += 1

                }

                updateXP()


            }, "le/1.79/" + classId + "/grades/", [json])

        }, "le/1.79/" + classId + "/grades/values/myGradeValues/", [li, classId])



        var p = document.createElement('p');
        p.innerHTML = className

        li.appendChild(p)

        classGrid.appendChild(li)
    }
}

function updateXP() {
    // console.log(TOTAL_GRADE)
    // console.info(TOTAL_GRADE_MAX)
    // console.error(TOTAL_GRADE_COUNT)

    var percent = (TOTAL_GRADE / TOTAL_GRADE_MAX) * 100.0
    // console.log(percent)

    var bar = document.getElementById("xpBar-bar")
    bar.style.width = Math.round(percent) + "%"
    bar.innerHTML = Math.round(percent) + "%"

    var avatar = AVATAR_MAP[0][1]
    for (var i = AVATAR_MAP.length - 1; i >= 0; i--) {
        if (percent >= AVATAR_MAP[i][0]) {
            avatar = AVATAR_MAP[i][1]
            break
        }
    }

    document.getElementById("avatarImg").src = "Resources/" + avatar


}

var apiReqScript = document.createElement('script');
apiReqScript.src = "api/api_http_req.js"
document.head.appendChild(apiReqScript);

var apiConvScript = document.createElement('script');
apiConvScript.src = "api/api_converter.js"
document.head.appendChild(apiConvScript);


window.onload = function() {
    main()
};

