// function onSignInCallback(authResult) {
//   helper.onSignInCallback(authResult,
//     function(authResult) {
//       $('.edit-post').show('slow')
//     },
//     function(authResult) {
//       $('.edit-post').hide('slow');
//     });
// }

// function onDisconnect() {
//   helper.disconnect(
//     function() {
//       console.log("disconnect pressed, success")
//     },
//     function() {
//       console.log("disconnect pressed, but failed");
//     });
// }

function buildFlickrItem(item) {
  var div = $('<div class="flickr-item"></div>');
  var link = $('<a>').attr('href', item.link);
  var image = $('<img class="flickr-image"></img>').attr('src',item.media.m);
  div.append(link.append(image));
  return div;
}
function jsonFlickrFeed(results) {
  console.log("found");
  if (results.items.length != 0) {
    var flickrDiv = $('<div class="flickr-images"></div>').appendTo('#portfolio-content');
    for (var i in results.items) {
      console.log(JSON.stringify(results.items[i]));
      flickrDiv.append(buildFlickrItem(results.items[i]));
    }
  } 
}
$(document).ready( function() {

    $.ajax({
        type: 'GET',
        url: 'https://api.flickr.com/services/feeds/photos_public.gne?id=49276656@N06&lang=en-us&format=json',

        dataType: 'jsonp',
        data:{},
        accept:'text/json',
        success: function(result) {

        },
        error: function(e) {
          console.log(e);
        }
      });
});