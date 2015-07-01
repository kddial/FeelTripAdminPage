// set page version to tell clients correct version
var pageVersion = 1;
var eventClass = "Events1";
var Event = Parse.Object.extend(eventClass);

// initialize Parse api
var api = JSON.parse(config);
Parse.initialize(api.app_key, api.js_key);

/* Apply code once page has loaded */
$(document).ready(function() {

  // set page version
  $("#page-version").html("Version " + pageVersion.toString());


  // query for events
  var query = new Parse.Query(Event);

  // query.equalTo("name", "test Beach party");
  query.descending("name");

  query.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length + " events.");

      //list headers
      // var output = "Object ID" + list_sep() + "Name" + list_sep() + "image"
      // $("#event_list").append('<li>' + output + '</li>');


      // construct output per event
      for (var i = 0; i < results.length; i++) {
        
        // construct output per event
        var object = results[i];
        var output = "";

        // image
        var objectImg = object.get('image');
        output += '<img class="list_image" src="' + objectImg.url() + '">'
        $("#event_list").append('<li class="image_li">' + output + '</li>');




        // object id
        output = "";
        output += ' <span style="font-size:6pt;">' + object.id + '</span>' + list_sep();

        // name
        var name = object.get('name');
        output += name + charCount(name) + list_sep();

        // description
        var description = object.get('description');
        output += description + charCount(description) + list_sep();





        $("#event_list").append('<li class="nonImage_li">' + output + '</li>');

        output = "";
        output = '<a id="' + object.id + '" href="#">Update</a>'


        $("#event_list").append('<li class="nonImage_li">' + output + '</li>');


        $("#event_list").append('<li> ___________________________________________________________________ </li>');

        // add update event handler
        $('#' + object.id).click(function() {
          
          // save event id to local storage
          localStorage.setItem("event_id", this.id);
          window.location.href="update_event.html";
          return false;
        });



      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }});


});


function list_sep() {
  return ' <span class="l_seperator"> - </span> ';
}

function charCount(stringToCount) {
  var len = stringToCount.length;
  return " (chars: " + len + ") ";
}
