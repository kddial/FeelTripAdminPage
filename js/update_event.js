// set page version to tell clients correct version
var pageVersion = 1;
var eventClass = "Events1";
var Event = Parse.Object.extend(eventClass);

// initialize Parse api
var api = JSON.parse(config);
Parse.initialize(api.app_key, api.js_key);

/* Apply code once page has loaded */
$(document).ready(function() {
  // prevent inputs from saving values
  $("form :input").attr("autocomplete", "off");

  // set page version
  $("#page-version").html("Version " + pageVersion.toString());

  // set event id
  var eventId = localStorage.getItem("event_id");
  $("#event-id").html("Event ID: " + eventId);


  // fill in sample event function
  fillInEventInfo(eventId);

  // animate loading button
  animateLoadingButton();
  $("#loading-button").hide();

  // Submit function
  $("#eventForm").on("submit", function(e) {
    e.preventDefault();
    console.log("Handling the submit");
    startSubmit();

    // get the event data
    // string input

    var currentEvent = new Event();
    currentEvent.id = eventId;



    currentEvent.set("name", $("#nameInput").val());
    currentEvent.set("description", $("#descriptionInput").val());
    currentEvent.set("address", $("#addressInput").val());
    currentEvent.set("email", $("#emailInput").val());
    currentEvent.set("comments", $("#commentsInput").val());
    currentEvent.set("website", $("#websiteInput").val());
    
    // number input
    var priceInput = $("#priceInput").val().trim();
    if (priceInput){
      currentEvent.set("price", JSON.parse(priceInput));
    };

    var phoneInput = $("#phoneInput").val().trim();
    if (phoneInput) {
      currentEvent.set("phone_number", JSON.parse(phoneInput));
    };

    // array input
    currentEvent.set("mood", $("#moodInput").val().split(",").map(Number).filter(Boolean));
    currentEvent.set("hashtags", $("#hashTagsInput").val().split(",").map(function(s) {return s.trim()}).filter(Boolean));

    // date input
    currentEvent.set("date_start", new Date($("#dateStartInput").val()));

    currentEvent.set("date_end", new Date($("#dateEndInput").val()));
    
    // get the event picture
    var imageUpload = $("#imageInput")[0];
    if (imageUpload.files.length > 0) {
      var image = imageUpload.files[0];
      var name = image.name;
      var imageObject = new Parse.File(name, image);
      currentEvent.set("image", imageObject);
    }

    // Save the event to Parse
    currentEvent.save(null, {
      success:function() {
        console.log("succes!");
        endSubmit("saved!");
        alert("saved!");

        // back to list view
        window.location.href="list_events.html";

        
      },
      error:function(error) {
        // console.log("error!");
        // console.dir(error);
        endSubmit();

        error_message = "Error: " + error.code + " " + error.message;
        alert(error_message);
        console.log(error_message);
        console.dir(error);
      }
    });
  });
});

/* Disable button while processing submission */
function startSubmit() {
  $("#submit-button").prop("disabled", true);

  $("#loading-blank-button").hide();
  $("#loading-button").show();
}

/* Re-enable button after processed submission */
function endSubmit() {
  $("#submit-button").prop("disabled", false);
  loading = false;

  $("#loading-blank-button").html("done");
  $("#loading-blank-button").show();
  $("#loading-button").hide();
}

/* Fill in event info. */
function fillInEventInfo(eventId) {

  // query for event
  var query = new Parse.Query(Event);
  query.get(eventId, {
    success: function(object) {
      console.log("got eem");




      $("#nameInput").prop("value", object.get("name"));
      $("#descriptionInput").prop("value", object.get("description"));
      $("#addressInput").prop("value", object.get("address"));
      $("#priceInput").prop("value", object.get("price"));


      // convert date
      var dateString = convertDateToString(object.get("date_start"))
      $("#dateStartInput").prop("value", dateString);
      var dateString = convertDateToString(object.get("date_end"))
      $("#dateEndInput").prop("value", dateString);


      $("#moodInput").prop("value", object.get("mood"));
      $("#hashTagsInput").prop("value", object.get("hashtags"));
      $("#commentsInput").prop("value", object.get("comments"));
      $("#websiteInput").prop("value", object.get("website"));
      $("#phoneInput").prop("value", object.get("phoneInput"));
      $("#emailInput").prop("value", object.get("email"));




    },
    error: function(object, error) {
      error_message = "Error: " + error.code + " " + error.message;
      alert(error_message);
      console.log(error_message);
    }
  });





}

/* Animate loading button (fade in and out) */
function animateLoadingButton() {
    var items = ["Loading", "Loading.", "Loading..", "Loading...", "Loading....", "Loading....."],
        $text = $( '#load-text' ),
        delay = 1; //seconds
    function loop ( delay ) {
        $.each( items, function ( i, elm ){
            $text.delay( delay*1E3).fadeOut();
            $text.queue(function(){
                $text.html( items[i] );
                $text.dequeue();
            });
            $text.fadeIn();
            $text.queue(function(){
                if ( i == items.length -1 ) {
                    loop(delay);   
                }
                $text.dequeue();
            });
        });
    }
    loop( delay );
}


/* Parse Input Dates into an array.
     Argument is date as a string.
     Return date represented as an array of ints [yyyy, mm, dd, hh, mm, ss]
*/
function parseDate(inputDate) {

    var dateArray = inputDate.split(",").map(Number).filter(Boolean);

    // subtract 1 from month (0 == January, 1 == Feburary)
    dateArray[1] = dateArray[1] - 1; 
    return dateArray;
}

function convertDateToString(date) {
  var dateString = date.toISOString();
  dateString = dateString.substring(0, dateString.length - 1);
  return dateString;
}



// might need later to convert date times
function convertTimeToCorrectTimeZone(date) {
  date = new Date( date.getTime() - ( date.getTimezoneOffset() * 60000 ) );
  var dateString = date.toISOString();
  dateString = dateString.substring(0, dateString.length - 1);
  return dateString;
}