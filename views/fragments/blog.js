
function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult,
    function(authResult) {
      $('.requires-login').addClass('logged-in');
    },
    function(authResult) {
      $('.requires-login').removeClass('logged-in');
    });
}

function onDisconnect() {
  helper.disconnect(
    function() {
      console.log("disconnect pressed, success")
    },
    function() {
      console.log("disconnect pressed, but failed");
    });
}

function buildPost(post) {
  var div = $('<div class="post"></div>');
  var title = $('<h2 class="title">' + post.title + '</h2>').append(' <span class="permalink">(<a href="/blog/post/' +post.id+ '">Permalink</a>)</span>');
  div.append(title);

  var date = new Date(post.created_at);
  div.append($('<h3 class="date">' + date.toLocaleDateString() + ', ' + date.toLocaleTimeString() + '</h3>'));
  div.append($('<p class="body"></p>').html(post.body));
  return div;
}

function showOlderPosts() {

  var data = { initial: initial,
               offset: offset,
               count: count };
  $.ajax({
        type: 'GET',
        url: '/blog/posts',
        contentType: 'application/json',
        data: data,
        success: function(result) {
          var postArray = JSON.parse(result);
          if (postArray.length != 0) {
            $(".latest").removeClass("latest");
            var newGroup = $('<div class="latest post-group"></div>').appendTo('.posts');
            for (var i in postArray) {
              console.log(JSON.stringify(postArray[i]));
              newGroup.append(buildPost(postArray[i]));
            }
            offset = data.offset + postArray.length;
            var queryStringParams = "/blog/" + postArray[0].id;
            // update URL without refreshing page
            if(window.history && window.history.pushState) {
              window.history.pushState(window.history.state, "", queryStringParams);
            }
          } 
          if (postArray[postArray.length-1].id == bounds.min) {
            hideOlderPostsButton();
          }
        },
        error: function(e) {
          console.log(e);
        }
      });
}
function hideOlderPostsButton() {
  $(".show-older").attr('disabled', 'disabled');
  $(".show-older").html('No more blog posts available');
}

function showNewerPosts() {
  var data = { initial: initial,
               count: count,
               direction : "newer" };
  $.ajax({
        type: 'GET',
        url: '/blog/posts',
        contentType: 'application/json',
        data: data,
        success: function(result) {
          var postArray = JSON.parse(result);
          if (postArray.length != 0) {
            $(".latest").removeClass("latest");
            var newGroup = $('<div class="latest post-group"></div>').prependTo('.posts');
            for (var i in postArray) {
              console.log(JSON.stringify(postArray[i]));
              newGroup.prepend(buildPost(postArray[i]));
            }
            initial = postArray[postArray.length-1].id;
            offset = offset + postArray.length;
            var queryStringParams = "/blog/" + postArray[postArray.length-1].id;
            // update URL without refreshing page
            if(window.history && window.history.pushState) {
              window.history.pushState(window.history.state, "", queryStringParams);
            }
          } 
          if (postArray[postArray.length-1].id == bounds.max) {
            hideNewerPostsButton();
          }
        },
        error: function(e) {
          console.log(e);
        }
      });
}
function hideNewerPostsButton() {
  $(".show-newer").attr('disabled', 'disabled');
  $(".show-newer").html('No more blog posts available');
}

$(document).ready( function() {
  $('.show-older').click(showOlderPosts);
  $('.show-newer').click(showNewerPosts);
});