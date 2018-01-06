"use strict";

const Wreck = require("wreck");

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect("/admin/login");
  }
  const movieApiHost = request.server.app.movieApiHost;
  const format = request.payload;

  try {
    const { payload } = await Wreck.post(`http://${movieApiHost}/formats`, {
      json: true,
      payload: format,
      headers: {
        "Authorization": request.state.mcsession
      }
    });

    return h.redirect("/admin/formats");
  } catch (err) {
    return err.statusCode === 401 ? h.redirect("/admin/login") : err;
  }
};
