"use strict";

const Wreck = require("wreck");
const movieApiHost = process.env.movie_api_host || "api:8080";

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect("/admin/login");
  }
  const movie = request.payload;

  try {
    const { payload } = await Wreck.post(`http://${movieApiHost}/movies`, {
      json: true,
      payload: movie,
      headers: {
        "Authorization": request.state.mcsession
      }
    });

    return h.redirect("/admin/movies");
  } catch (err) {
    return err.statusCode === 401 ? h.redirect("/admin/login") : err;
  }
};
