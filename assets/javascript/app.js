// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD5jVujjMs88BhIKw9dP6eXUqPNHRbgXTE",
    authDomain: "train-scheduler-1dc23.firebaseapp.com",
    databaseURL: "https://train-scheduler-1dc23.firebaseio.com",
    projectId: "train-scheduler-1dc23",
    storageBucket: "train-scheduler-1dc23.appspot.com",
    messagingSenderId: "706271519972",
    appId: "1:706271519972:web:a329300736e58b6357f8f1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database
var database = firebase.database();

$("#add-train").on("click", function (event) {
    event.preventDefault();

    var record = {
        name: $("#train-name-input").val(),
        destination: $("#destination-input").val(),
        firstTrain: $("#first-train-input").val(),
        frequency: $("#frequency-input").val()
    }
    console.log(record);
    database.ref().push(record);

    //clear text fields
    $("#train-name-input").empty();
    $("#destination-input").empty();
    $("#first-train-input").val("");
    $("#frequency-input").val("");

})


//when database changes, when a child is added to db, triggers event
database.ref().on("child_added", function (snapshot) {
    console.log("Database changed")
    var sv = snapshot.val();

    var trainName = sv.name;
    var destination = sv.destination;
    var firstTrain = sv.firstTrain;
    var frequency = sv.frequency;
    var hours = firstTrain.split(":")[0];
    var minutes = firstTrain.split(":")[1];
    firstTrain = moment().hours(hours).minutes(minutes);

    //change format to hh:mm 
    var formatFirstTrain = firstTrain.format("hh:mm A");
    //moment() gives us current moment
    var trainMinutes = Math.abs(moment().diff(firstTrain, "minutes"));
    var calcMinAway = trainMinutes % frequency;
    // if (trainMinutes > 0) {
    //     var nextTrain = firstTrain;

    // } else {
        var nextTrain = moment().add(calcMinAway, "m").format("hh:mm A");
    // }
    var tRow = $('<tr>').append(
        $('<td>').text(trainName),
        $('<td>').text(destination),
        // $('<td>').text(firstTrain),
        $('<td>').text(frequency),
        $('<td>').text(nextTrain),
        $('<td>').text(calcMinAway)


    );
    $("table tbody").append(tRow);
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
})