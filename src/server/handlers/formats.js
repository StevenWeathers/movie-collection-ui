'use strict'

const Wreck = require('wreck')

module.exports = async (request, h) => {
  const movieApiHost = request.server.app.movieApiHost

  try {
    const { payload } = await Wreck.get(`http://${movieApiHost}/formats`, { json: true })

    return h.response(payload.data.formats)
      .code(200)
  } catch (err) {
    return err
  }
}
