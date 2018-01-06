"use strict";

const Wreck = require("wreck");
const movieApiHost = process.env.movie_api_host || "api:8080";

module.exports = async (request, h) => {
  const { email, password } = request.payload;

  try {
    const { payload } = await Wreck.post(`http://${movieApiHost}/auth`, { json: true, payload: { email, password } });

    // set JWT cookie
    h.state('mcsession', payload.token);

    return h.redirect("/admin/movies");
  } catch (err) {
    return err.statusCode === 401 ? h.redirect("/admin/login") : err;
  }
};
