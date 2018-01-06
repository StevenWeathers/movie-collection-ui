"use strict";

const Wreck = require("wreck");

module.exports = async (request, h) => {
  const movieApiHost = request.server.app.movieApiHost;
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
