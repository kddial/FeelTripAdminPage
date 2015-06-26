// set page version to tell clients correct version
var pageVersion = 2;

// initialize Parse api
var api = JSON.parse(config);
Parse.initialize(api.app_key, api.js_key);

/* Apply code once page has loaded */
$(document).ready(function() {
  // prevent inputs from saving values
  $("form :input").attr("autocomplete", "off");

  // set page version
  $("#page-version").html("Version " + pageVersion.toString());

  // save test objects
  // testParseObject();

  // fill in sample event function
  sampleEvent();

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
    var data = {};
    data.name = $("#nameInput").val();
    data.description = $("#descriptionInput").val();
    data.address = $("#addressInput").val();
    data.email = $("#emailInput").val();
    data.comments = $("#commentsInput").val();
    data.website = $("#websiteInput").val();
    
    // number input
    data.price = JSON.parse($("#priceInput").val());
    data.phone_number = JSON.parse($("#phoneInput").val());

    // array input
    data.mood = $("#moodInput").val().split(",").map(Number).filter(Boolean);
    data.hashtags = $("#hashTagsInput").val().split(",").map(function(s) {return s.trim()}).filter(Boolean);

    // date input
    //    pass in array as arugments
    //    source: http://stackoverflow.com/questions/11291206/passing-an-array-to-the-javascript-date-constructor-is-it-standard
    var dateArray = parseDate($("#dateStartInput").val());
    data.date_start = new (Function.prototype.bind.apply(
                            Date, [null].concat(dateArray)));

    dateArray = parseDate($("#dateEndInput").val());

    data.date_end = new (Function.prototype.bind.apply(
                            Date, [null].concat(dateArray)));
    

    // get the event picture
    var imageUpload = $("#imageInput")[0];
    if (imageUpload.files.length > 0) {
      var image = imageUpload.files[0];
      var name = image.name;
      var imageObject = new Parse.File(name, image);
      data.image = imageObject;
    }

    // Save the event to Parse
    // var event = Parse.Object.extend("Events");
    var event = Parse.Object.extend("Events1"); // testing purposes
    var eventObject = new event();
    eventObject.save(data, {
      success:function() {
      console.log("succes!");
      endSubmit("saved!");
      alert("saved!");

      // back to top of page
      $("html, body").animate({scrollTop: 0}, 200);

      // reset values
       $(':input','#eventForm')
         .not(':button, :submit, :reset, :hidden')
         .val('')
         .removeAttr('checked')
         .removeAttr('selected');
      },
      error:function(error) {
        console.log("error!");
        console.dir(error);
        endSubmit();
        alert("error!");
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

/* Fill in sample event info. Uses FILL IN SAMPLE button on UI. */
function sampleEvent() {
  $("#sample-event").click(function() {
    $("#nameInput").prop("value", "test Beach party");
    $("#descriptionInput").prop("value", "Let's have some fun in the sun! Bring your friends, family, dogs, beers, food, smiles!");
    $("#addressInput").prop("value", "909 Lake Shore Boulevard West, Toronto, ON M6K 3L3");
    $("#priceInput").prop("value", 22);
    $("#dateStartInput").prop("value", "2015, 4, 22, 13, 30");
    $("#dateEndInput").prop("value", "2015, 4, 22, 14");
    $("#moodInput").prop("value", "1, 2, 3");
    $("#hashTagsInput").prop("value", "#test, #test2,#test3");
    $("#commentsInput").prop("value", "This event occurs every sunday");
    $("#websiteInput").prop("value", "www.feeltrip.com");
    $("#phoneInput").prop("value", 4161234567);
    $("#emailInput").prop("value", "kk@kk.com");
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

/* Simple test to save Parse objects */
// function testParseObject() {
//   // Save the event to Parse
//   // var event = Parse.Object.extend("Events");
//   var event = Parse.Object.extend("EventsTest3"); // testing purposes
//   var eventObject = new event();

//   var data = {};

//   var currentDate = new Date();
//   data.date1 = currentDate;

//   // data.date2 = new Date([2015, 4, 22, 13]);
//   //                 yyyy, mm-1, dd, hh, mm, ss
//   data.date3 = new Date(2015, 3, 22, 1, 10, 20); // april 22, 1 am (EDT), 10 minutes, 20 seconds


//   eventObject.save(data, {
//     success:function() {
//       console.log("succes!");
//       alert("saved!");
//     },
//     error:function(error) {
//       console.log("error!");
//       console.dir(error);
//       alert("error!");
//     }
//   });
// }

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
