'use strict';

const Wreck = require('wreck')

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect('/admin/login')
  }
  const movieApiHost = request.server.app.movieApiHost
  const formatId = request.params.id

  try {
    const { payload } = await Wreck.put(`http://${movieApiHost}/formats/${formatId}`, {
      json: true,
      payload: request.payload,
      headers: {
        'Authorization': request.state.mcsession
      }
    })

    return h.response(payload)
  } catch (err) {
    return err.statusCode === 401 ? h.redirect('/admin/login') : err
  }
}
