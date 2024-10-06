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
      let item = classes.Items[i];
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

    // Display classes in console
    console.log(userClasses);

  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

// Declare grades variable to store JSON data
function getGrades(){
  fetch(userGradesPath)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    grades = data;
    console.log(grades);
    for (let i = 0; i < grades.Items.length; i++) {
      let item = grades.Items[i];
      console.log(item);
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}



