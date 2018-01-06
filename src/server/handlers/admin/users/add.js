"use strict";

const Wreck = require("wreck");

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect("/admin/login");
  }
  const movieApiHost = request.server.app.movieApiHost;
  const user = request.payload;

  try {
    const { payload } = await Wreck.post(`http://${movieApiHost}/users`, {
      json: true,
      payload: user,
      headers: {
        "Authorization": request.state.mcsession
      }
    });

    return h.redirect("/admin/users");
  } catch (err) {
    return err.statusCode === 401 ? h.redirect("/admin/login") : err;
  }
};
