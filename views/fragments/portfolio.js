function buildFlickrItem(item) {
  var div = $('<div class="flickr-item"></div>');
  var link = $('<a>').attr('href', item.link);
  var image = $('<img class="flickr-image"></img>').attr('src',item.media.m.replace("_m.jpg", ".jpg"));
  div.append(link.append(image));
  return div;
}

function jsonFlickrFeed(results) {
  if (results.items.length != 0) {
    var flickrDiv = $('.flickr-images');
    for (var i in results.items) {
      flickrDiv.append(buildFlickrItem(results.items[i]));
    }
  } 
}

function buildYoutubeItem(item) {
  var div = $('<div class="youtube-item"></div>');
  var link = $('<a>').attr('href', "http://youtu.be/" + item.snippet.resourceId.videoId);
  var image = $('<img class="youtube-image"></img>').attr('src',item.snippet.thumbnails.medium.url);
  div.append(link.append(image));
  return div;
}

function jsonYoutubeFeed(results) {
  if (results.items.length != 0) {
    var flickrDiv = $('.youtube-videos');
    for (var i in results.items) {
      flickrDiv.append(buildYoutubeItem(results.items[i]));
    }
  } 
}

$(document).ready( function() {

    $.ajax({
        type: 'GET',
        url: 'https://api.flickr.com/services/feeds/photos_public.gne?id=49276656@N06&lang=en-us&format=json',

        dataType: 'jsonp',
        accept:'text/json',
        success: function(result) {
          //Flickr API automatically calls jsonFlickrFeed()
        },
        error: function(e) {
          console.log("Flickr API Error: " + e);
        }
      });


    $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUeZS-GQGdKFqajW5ERvXd9w&key=AIzaSyCU42JPkcy7vrZxa-HB_4axxn8u9qdrFn4&maxResults=10',
        data:{},
        accept:'text/json',
        success: function(result) {
          jsonYoutubeFeed(result);
        },
        error: function(e) {
          console.log("Flickr API Error: " + e);
        }
      });
});

function expandProject(index) {
  $('.project-title').text(projects[index].title);
  $('a.project-title').attr('href', projects[index].redirect_url);
  $('img.project-image').attr('src',projects[index].detailed_image);
  $('p.project-description').html(projects[index].body);
  $('a.project-link').attr('href', projects[index].redirect_url);
}