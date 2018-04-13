'use strict';

const Wreck = require('wreck')

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect('/admin/login')
  }
  const movieApiHost = request.server.app.movieApiHost
  const movie = request.payload

  try {
    const { payload } = await Wreck.post(`http://${movieApiHost}/movies`, {
      json: true,
      payload: movie,
      headers: {
        'Authorization': request.state.mcsession
      }
    })

    return h.redirect('/admin/movies')
  } catch (err) {
    return err.statusCode === 401 ? h.redirect('/admin/login') : err
  }
}
