
// initialize Parse api
var api = JSON.parse(config);
Parse.initialize(api.app_key, api.js_key);

/* Apply code once page has loaded */
$(document).ready(function() {
  // prevent inputs from saving values
  $("form :input").attr("autocomplete", "off");

  // fill in sample event
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
    var data = {};
    data.name = $("#nameInput").val();
    data.description = $("#descriptionInput").val();
    data.address = $("#addressInput").val();
    data.price = $("#priceInput").val();
    data.date_start = $("#dateStartInput").val();
    data.date_end = $("#dateEndInput").val();
    data.mood = $("#moodInput").val();
    data.hashtags = $("#hashTagsInput").val();
    data.website = $("#websiteInput").val();
    data.phone_number = $("#phoneInput").val();
    data.email = $("#emailInput").val();

    // get the event picture
    var imageUpload = $("#imageInput")[0];
    if (imageUpload.files.length > 0) {
      var image = imageUpload.files[0];
      var name = image.name;
      var imageObject = new Parse.File(name, image);
      data.image = imageObject;
    }

    // Save the event to Parse
    var event = Parse.Object.extend("Events");
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

  $("#loading-blank-button").show();
  $("#loading-button").hide();
}


/* Fill in sample event info */
function sampleEvent() {
  $("#sample-event").click(function() {
    $("#nameInput").prop("value", "test");
    $("#descriptionInput").prop("value", "test");
    $("#addressInput").prop("value", "test event");
    $("#priceInput").prop("value", 22);
    $("#dateStartInput").prop("value", "[2015, 4, 22, 13, 0, 0]");
    $("#dateEndInput").prop("value", "[2015, 4, 22, 13, 0, 0]");
    $("#moodInput").prop("value", "[2]");
    $("#hashTagsInput").prop("value", "[#test]");
    $("#websiteInput").prop("value", "www.kevindial.com");
    $("#phoneInput").prop("value", "4161234567");
    $("#emailInput").prop("value", "kk@kk.com");
  });
}

/* Fade loading in and out */
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