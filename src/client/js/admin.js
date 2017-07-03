// all this is rather hacky, just barebones to make functional until Marko is utilized on front-end

// Delete Movie
(function(){

  var $deleteMovies = document.getElementsByClassName("js-movie-delete");

  var deleteMovie = function(id, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var response = JSON.parse(xhr.response);

        callback(null, response);
      }
    };

    xhr.open("DELETE", "/admin/movies/"+id, true);
    xhr.send();
  };

  for(var i = 0; i < $deleteMovies.length; i++) {
    $deleteMovies[i].addEventListener("click", function(event) {
      event.preventDefault();
      var movieNum = event.target.dataset.movienum;
      var movieId = event.target.dataset.movieid;

      deleteMovie(movieId, function(err, response) {
        if (!err && response.data.deleteMovie._id === movieId) {
          alert("Movie deleted.");
          var element = document.getElementById("movie-"+movieNum);
          element.parentNode.removeChild(element);
        } else {
          alert("movie couldn't be deleted");
        }
      });
    });
  }

}());

// Edit Movie
(function(){

  var $editMovie = document.getElementsByClassName("js-movie-form");

  var editMovie = function(id, movie, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status == "200") {
        var response = JSON.parse(xhr.response);

        callback(null, response);
      }
    };

    xhr.open("PUT", "/admin/movies/"+id, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(JSON.stringify(movie));
  };

  for(var i = 0; i < $editMovie.length; i++) {
    $editMovie[i].addEventListener("submit", function(event) {
      var $form = event.target;

      if ($form.dataset.edit) {
        event.preventDefault();
        var movie = {
          "title": document.getElementsByName("title")[0].value,
          "year": document.getElementsByName("year")[0].value,
          "upc": document.getElementsByName("upc")[0].value,
          "tmdb_id": document.getElementsByName("tmdb_id")[0].value,
          "tmdb_image_url": document.getElementsByName("tmdb_image_url")[0].value,
          "format": document.getElementsByName("format")[0].value
        };
        var movieId = document.getElementsByName("movieid")[0].value;

        editMovie(movieId, movie, function(err, response) {
          if (!err && response.data.updateMovie._id === movieId) {
            window.location.reload();
          } else {
            alert("movie couldn't be updated");
          }
        });
      }
    });
  }

}());


/**
 *  USERS
 */
// Edit User
(function(){

  var $editUser = document.getElementsByClassName("js-user-form");

  var editUser = function(id, user, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status == "200") {
        var response = JSON.parse(xhr.response);

        callback(null, response);
      }
    };

    xhr.open("PUT", "/admin/users/"+id, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(JSON.stringify(user));
  };

  for(var i = 0; i < $editUser.length; i++) {
    $editUser[i].addEventListener("submit", function(event) {
      var $form = event.target;

      if ($form.dataset.edit) {
        event.preventDefault();
        var user = {
          "email": document.getElementsByName("email")[0].value,
          "password": document.getElementsByName("password")[0].value
        };
        var userId = document.getElementsByName("userid")[0].value;

        editUser(userId, user, function(err, response) {
          if (!err && response.data.updateUser._id === userId) {
            window.location.reload();
          } else {
            alert("user couldn't be updated");
          }
        });
      }
    });
  }

}());
