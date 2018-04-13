'use strict';

const adminMatchTmdbTemplate = require('../../views/admin/matchtmdb')
const Wreck = require('wreck')

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect('/admin/login')
  }
  const movieApiHost = request.server.app.movieApiHost

  try {
    const { payload } = await Wreck.get(`http://${movieApiHost}/match-tmdb?title=${request.query.title}`, {
      json: true,
      headers: {
        'Authorization': request.state.mcsession
      }
    })

    return h.response(adminMatchTmdbTemplate.stream({
      results: payload
    })).type('text/html').code(200)
  } catch (err) {
    return err.statusCode === 401 ? h.redirect('/admin/login') : err
  }
}
