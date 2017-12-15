
$(document).ready(function(){

  // Current time for the jumbotron
  var curDate = Date();
  $("#time").html(curDate);
 
   // Initialize Firebase
   var config = {
    apiKey: "AIzaSyDhCvEPH04br5vSd9ufM9kRMgzFdYy4Ht4",
    authDomain: "get-gone-train-schedule.firebaseapp.com",
    databaseURL: "https://get-gone-train-schedule.firebaseio.com",
    projectId: "get-gone-train-schedule",
    storageBucket: "get-gone-train-schedule.appspot.com",
    messagingSenderId: "762311928780"
  };

  firebase.initializeApp(config);

  // Assign the reference to the database to a variable named 'database'
  var database = firebase.database();

  //variables for the train schedule
  var trainName = "No train yet";
  var trainDest = "No destination yet";
  //This train runs every 10 minutes
  var trainFreq = 10;
  console.log(trainFreq);
  //This train starts daily at 08:00
  var trainFirstTime = moment().add(trainFreq, 'minutes');
  console.log(trainFirstTime);
  //Next arrival equals current time - 08:00 / 10
  var trainNextArr = moment(trainFirstTime).add(trainFreq, 'minutes'); //trainFirstTime + (trainFreq/60);
  console.log(trainNextArr);
  var trainMinAway = moment().diff(trainNextArr, 'minutes');
  console.log(trainMinAway);
  
  // At the initial load and subsequent value changes, get a snapshot of the stored data.
  database.ref().on("child_added", function(snapshot) {
    
    // If Firebase has train data stored (first case)
    if (snapshot.child("destination").exists()){

   // Set the variables equal to the stored values in firebase.
      trainName = snapshot.val().name;
      trainDest = snapshot.val().destination;
      trainFirstTime = snapshot.val().firstTime;
      trainFreq = snapshot.val().frequency;
      trainNextArr = snapshot.val().trainNextArr;
      trainMinAway = snapshot.val().trainMinAway;
      console.log(trainName);
      console.log(trainDest);
      console.log(trainFirstTime);
      console.log(trainFreq);
      console.log(trainNextArr);
      console.log(trainMinAway);
      addTrainHTML();
  	} else {

        //Click event to add a train to the HTML and to the database
        $("#submitRow").on("click",function(event){
          //Prevent the form from submitting
          event.preventDefault();
          //Get the input values
          trainName = $("#trainName").val().trim();
          trainDest = $("#destination").val().trim();
          trainFirstTime = $("#firstTrainTime").val().trim();
          trainFreq = $("#frequency").val().trim();

          //Calculate the Next Arrival and Minutes Away values
          trainNextArr = parseInt(trainFirstTime + (trainFreq/60));
          trainMinAway = parseInt(trainNextArr - (10/60));

          //Display the train variable values
          console.log(trainName);
          console.log(trainDest);
          console.log(trainFirstTime);
          console.log(trainFreq);
          console.log(trainNextArr);
          console.log(trainMinAway);

          // Save the new train in Firebase
          database.ref().push({
            name: trainName,
            destination: trainDest,
            firstTime: trainFirstTime,
            frequency: trainFreq,
            nextArrival: trainNextArr,
            minAway: trainMinAway
          });

        //Call the add train function
        addTrainHTML();

        //Clear the form
        $("#trainName").empty();
        $("#destination").empty();
        $("#firstTrainTime").empty();
        $("#frequency").empty();
        $("#nextArrival").empty();
        $("#minAway").empty();

      });
   	}
  });

  // Create a function to add the train to the html
  function addTrainHTML(){
  var markup = "<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + trainNextArr + "</td><td>" + trainMinAway + "</td></tr>";
  $("table tbody").append(markup);
  }
});


