"use strict";

const Wreck = require("wreck");
const adminMoviesTemplate = require('../../../views/admin/movies');
const movieApiHost = process.env.movie_api_host || "api:8080";

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect("/admin/login");
  }

  try {
    const getFormats = Wreck.get(`http://${movieApiHost}/formats`, { json: true });
    const getMovies = Wreck.get(`http://${movieApiHost}/movies`, { json: true });
    const [movies, formats] = await Promise.all([getMovies, getFormats]);

    return h.response(adminMoviesTemplate.stream({
      movies: movies.payload.data.movies,
      formats: formats.payload.data.formats
    })).type('text/html').code(200);
  } catch (err) {
    return err.statusCode === 401 ? h.redirect("/admin/login") : err;
  }
};