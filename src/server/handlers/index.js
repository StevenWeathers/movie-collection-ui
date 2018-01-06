"use strict";

const indexTemplate = require('../views/index');
const movieApiHost = process.env.movie_api_host || "api:8080";
const Wreck = require("wreck");

module.exports = async (request, h) => {
  try {
    const { payload } = await Wreck.get(`http://${movieApiHost}/movies`, { json: true });
    const html = indexTemplate.stream({
      movies: payload.data.movies
    });

    return h.response(html)
      .type('text/html')
      .code(200);
  } catch (err) {
    return err;
  }
};
