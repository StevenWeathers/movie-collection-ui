"use strict";

const adminFormatsTemplate = require('../../../views/admin/formats');
const Wreck = require("wreck");

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect("/admin/login");
  }
  const movieApiHost = request.server.app.movieApiHost;

  try {
    const { payload } = await Wreck.get(`http://${movieApiHost}/formats`, {
      json: true,
      headers: {
        "Authorization": request.state.mcsession
      }
    });

    return h.response(adminFormatsTemplate.stream({
      formats: payload.data.formats
    })).type('text/html').code(200);
  } catch (err) {
    return err.statusCode === 401 ? h.redirect("/admin/login") : err;
  }
};
