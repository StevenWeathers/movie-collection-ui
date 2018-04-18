'use strict'

const Wreck = require('wreck')

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.code(401).response('failure')
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

    return h.response(payload)
  } catch (err) {
    return err
  }
}
