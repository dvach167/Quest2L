const userInfo = '{"Identifier":"44382","FirstName":"Ghassan","LastName":"Al Najjar","Pronouns":"","UniqueName":"galna086","ProfileIdentifier":"eTLOrOm2Aq"}';
const userClassesPath = "./api/classes.json";
const userGradesPath = "./api/grades.json";

// Convert JSON string to object
const user = JSON.parse(userInfo);

// Declare classes variable to store JSON data
let classes;

// Display first name in an element with id "fName"
function getFirstName() {
  document.getElementById("fName").innerHTML = user.FirstName;
}

// Return last name
function getLastName() {
  return user.LastName;
}

// Returns email
function getEmail() {
  return user.UniqueName + "@mtroyal.ca";
}

// Addes classes to userClasses array
function getClasses() {
  let userClasses = [];

  // Fetch classes JSON
  fetch(userClassesPath)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    classes = data; // Assign fetched data to classes
    for (let i = 0; i < classes.Items.length; i++) {
      // Check if user has access to
      const item = classes.Items[i];
      if (item.Access.CanAccess === true && item.Access.LastAccessed != null && item.Access.StartDate != null) {

        // Check if class is already in array
        let newClass = true;
        for (let j = 0; j < userClasses.length; j++){
          if (item.OrgUnit.Name === userClasses[j]){
            console.log("Already in array");
            newClass = false;
            break;
          }
        }

        // If class is not already in array, add it
        if (newClass)
            userClasses.push({
            name: item.OrgUnit.Name,
            id: item.OrgUnit.Id
            });
      } else {
        console.log("No Access");
      }
    }

    return userClasses;

  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  return null;
}

// Declare grades variable to store JSON data
function getGrades(){
  // Declare grades variable to store JSON data
  let userGrades = [];

  // Fetch grades JSON
  fetch(userGradesPath)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    grades = data;
    for (let i = 0; i < grades.length; i++) {
      const taskName = grades[i].GradeObjectName;
      const WeightedNumerator = grades[i].WeightedNumerator;
      const WeightedDenominator = grades[i].WeightedDenominator;
      const Grade = grades[i].DisplayedGrade;

      // Check if grade is not a category
      if (grades[i].GradeObjectTypeName != "Category") {
        let gradePer =  WeightedNumerator / WeightedDenominator;

        // Add grades to userGrades array
        userGrades.push({
          taskName: taskName,
          WeightedNumerator: WeightedNumerator,
          WeightedDenominator: WeightedDenominator,
          Grade: Grade,
          gradePer: Math.round((WeightedNumerator / WeightedDenominator) * 100)
        });
      }
    }

    let totalMark = 0;
    let totalWeight = 0;
    for (let i = 0; i < userGrades.length; i++){
      totalMark += userGrades[i].WeightedNumerator;
      totalWeight += userGrades[i].WeightedDenominator;
    }
    let actualMark = Math.round((totalMark / totalWeight) * 100);

    // Display grades in console
    console.log(userGrades);
    
    return actualMark;
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  return null;
}



