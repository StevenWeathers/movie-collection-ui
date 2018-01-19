// all this is rather hacky, just barebones to make functional until Marko is utilized on front-end

/**
 *  Movies
 */
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
          if (!err) {
            window.location.reload();
          } else {
            alert("movie couldn't be updated");
          }
        });
      }
    });
  }

}());

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
          var element = document.getElementById("movie-" + movieNum);
          element.parentNode.removeChild(element);
        } else {
          alert("movie couldn't be deleted");
        }
      });
    });
  }

}());

/**
 *  FORMATS
 */
// Edit Format
(function(){

  var $editFormat = document.getElementsByClassName("js-format-form");

  var editFormat = function(id, format, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status == "200") {
        var response = JSON.parse(xhr.response);

        callback(null, response);
      }
    };

    xhr.open("PUT", "/admin/formats/"+id, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(JSON.stringify(format));
  };

  for(var i = 0; i < $editFormat.length; i++) {
    $editFormat[i].addEventListener("submit", function(event) {
      var $form = event.target;

      if ($form.dataset.edit) {
        event.preventDefault();
        var format = {
          "title": document.getElementsByName("title")[0].value
        };
        var formatId = document.getElementsByName("formatid")[0].value;

        editFormat(formatId, format, function(err, response) {
          if (!err) {
            window.location.reload();
          } else {
            alert("format couldn't be updated");
          }
        });
      }
    });
  }

}());

// Delete Format
(function(){

  var $deleteFormats = document.getElementsByClassName("js-format-delete");

  var deleteFormat = function(id, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var response = JSON.parse(xhr.response);

        callback(null, response);
      }
    };

    xhr.open("DELETE", "/admin/formats/"+id, true);
    xhr.send();
  };

  for(var i = 0; i < $deleteFormats.length; i++) {
    $deleteFormats[i].addEventListener("click", function(event) {
      event.preventDefault();
      var formatNum = event.target.dataset.formatnum;
      var formatId = event.target.dataset.formatid;

      deleteFormat(formatId, function(err, response) {
        if (!err && response.data.deleteFormat._id === formatId) {
          alert("Format deleted.");
          var element = document.getElementById("format-" + formatNum);
          element.parentNode.removeChild(element);
        } else {
          alert("Format couldn't be deleted");
        }
      });
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
          if (!err) {
            window.location.reload();
          } else {
            alert("user couldn't be updated");
          }
        });
      }
    });
  }

}());

// Delete User
(function(){

  var $deleteUser = document.getElementsByClassName("js-user-delete");

  var deleteUser = function(id, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var response = JSON.parse(xhr.response);

        callback(null, response);
      }
    };

    xhr.open("DELETE", "/admin/users/"+id, true);
    xhr.send();
  };

  for(var i = 0; i < $deleteUser.length; i++) {
    $deleteUser[i].addEventListener("click", function(event) {
      event.preventDefault();
      var userNum = event.target.dataset.usernum;
      var userId = event.target.dataset.userid;

      deleteUser(userId, function(err, response) {
        if (!err && response.data.deleteUser._id === userId) {
          alert("User deleted.");
          var element = document.getElementById("user-" + userNum);
          element.parentNode.removeChild(element);
        } else {
          alert("User couldn't be deleted");
        }
      });
    });
  }

}());

// TMDB
(function(){
  var $matchTmdb = document.getElementById("movietitle");

  var matchTmdb = function(movieTitle, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status == "200") {
        callback(null, xhr.response);
      }
    };

    xhr.open("GET", "/admin/match-tmdb?title=" + movieTitle, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send();
  };

  $matchTmdb.addEventListener("input", function(event) {
    matchTmdb(event.target.value, function(err, response) {
      if (!err) {
        document.getElementById('MatchedMovies').innerHTML = response;

        var $matchedMovie = document.getElementsByClassName("js-matched-movie");

        for(var i = 0; i < $matchedMovie.length; i++) {
          $matchedMovie[i].addEventListener("click", function(event) {
            event.preventDefault();
            var matchedInfo = event.target.dataset;
            var id = matchedInfo.id;
            var year = matchedInfo.year;
            var poster = matchedInfo.poster;
            var title = matchedInfo.title;

            document.getElementById('movieyear').value = year;
            document.getElementById('movietmdbid').value = id;
            document.getElementById('movietmdbimg').value = poster;
            document.getElementById('movietitle').value = title;

            document.getElementById('MatchedMovies').innerHTML = '';
          });
        }
      } else {
        alert("movie couldn't be matched");
      }
    });
  });

}());
