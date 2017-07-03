// all this is rather hacky, just barebones to make functional until Marko is utilized on front-end

var $deleteMovies = document.getElementsByClassName("js-movie-delete");

var deleteMovie = function(id, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var response = JSON.parse(xhr.response);

      callback(null, response);
    }
  };

  xhr.open("DELETE", "/admin/movies/"+id);
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
