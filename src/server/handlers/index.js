"use strict";

const indexTemplate = require('../views/index');
const Wreck = require("wreck");

module.exports = async (request, h) => {
  const movieApiHost = request.server.app.movieApiHost;

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
