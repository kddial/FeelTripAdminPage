
// initialize Parse api
var api = JSON.parse(config);
Parse.initialize(api.app_key, api.js_key);

// new Event object



$(document).ready(function() {

  // turn off form saved values
  $("form :input").attr("autocomplete", "off");

  // Submit function
  $("#eventForm").on("submit", function(e) {
      e.preventDefault();
    console.log("Handling the submit");

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
    }
    });


  });
});