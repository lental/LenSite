function onSignInCallback(authResult) {
  helper.onSignInCallback(authResult,
    function(authResult) {
      $('.create-post').show('slow')
    },
    function(authResult) {
      $('.create-post').hide('slow');
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
/*
.post
  h2.title #{posts[i].title} 
    span.permalink (
      a(href="blog/#{posts[i].id}") Permalink
      | )
  h3.date #{posts[i].created_at.toLocaleDateString()}, #{posts[i].created_at.toLocaleTimeString()}
  p.body #{posts[i].body}
*/
  var div = $('<div class="post"></div>');
  var title = $('<h2 class="title">' + post.title + '(</h2>').append('<a href="' + '">Permalink</a>)');
  div.append(title);

  var date = new Date(post.created_at);
  div.append($('<h3 class="date">' + date.toLocaleDateString() + ', ' + date.toLocaleTimeString() + '</h3>'));
  div.append($('<p class="body">' + post.body + '</p>'));
  return div;
}

function showMorePosts() {
  var initial = $("#initial").val();
  var offset = $("#offset").val();
  var count = 5;
  $.ajax({
        type: 'GET',
        url: '/blog/posts',
        contentType: 'application/json',
        data: { initial : initial,
                offset : offset,
                count: 5 },
        success: function(result) {
          var postArray = JSON.parse(result);
          for (var i in postArray) {
            console.log(JSON.stringify(postArray[i]));
            buildPost(postArray[i]).insertBefore(".footer");
            $("#offset").val(offset + count);
          }
          if (postArray.length < count) {
            hideMorePostsButton();
          }
        },
        error: function(e) {
          console.log(e);
        }
      });
}

function hideMorePostsButton() {
  $(".show-more").attr('disabled', 'disabled');
  $(".show-more").html('No more blog posts available');
}

$(document).ready( function() {
  $('.create-post').hide('slow');
  $('.show-more').click(showMorePosts);
});