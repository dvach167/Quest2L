var TOTAL_GRADE = 0
var TOTAL_GRADE_MAX = 0
var TOTAL_GRADE_COUNT = 0

function main() {
    apiGet(whoami_callback, "lp/1.47/users/whoami")
    apiGet(myenrollments_callback, "lp/1.47/enrollments/myenrollments/?orgUnitTypeId=3&isActive=true&canAccess=true")

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
            } else {
                li.classList.add("classGrid-red");
            }

            apiGetData(function(jsonString, data) {
                var json = parseApi(jsonString)
                var myGrades = data[0]

                for (var i = 0; i < json.length; i++) {
                    var max_grade = json[i]["Weight"]
                    var grade = 0

                    for (var j = 0; j < myGrades.length; j++) {
                        if (myGrades[j]["GradeObjectTypeName"] != "Numeric") {
                            continue
                        }

                        if (myGrades[j]["GradeObjectIdentifier"] == json[i]["Id"]) {
                            grade = (myGrades[j]["PointsNumerator"] / myGrades[j]["PointsDenominator"]) * json[i]["Weight"]
                            break
                        }

                    }
                    TOTAL_GRADE += grade
                    TOTAL_GRADE_MAX += max_grade
                    TOTAL_GRADE_COUNT += 1

                }

                updateEP()


            }, "le/1.79/" + classId + "/grades/", [json])

        }, "le/1.79/" + classId + "/grades/values/myGradeValues/", [li, classId])



        var strong = document.createElement('strong');
        strong.innerHTML = className

        li.appendChild(strong)

        classGrid.appendChild(li)
    }
}

function updateEP() {
    console.log(TOTAL_GRADE)
    console.info(TOTAL_GRADE_MAX)
    console.error(TOTAL_GRADE_COUNT)

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

