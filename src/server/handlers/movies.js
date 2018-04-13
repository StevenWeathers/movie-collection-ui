'use strict'

const Wreck = require('wreck')

module.exports = async (request, h) => {
  const movieApiHost = request.server.app.movieApiHost

  try {
    const { payload } = await Wreck.get(`http://${movieApiHost}/movies`, { json: true })

    return h.response(payload.data.movies)
      .code(200)
  } catch (err) {
    return err
  }
}
