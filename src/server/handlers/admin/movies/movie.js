'use strict';

const adminMovieEditTemplate = require('../../../views/admin/editmovie')
const Wreck = require('wreck')

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect('/admin/login')
  }
  const movieApiHost = request.server.app.movieApiHost

  try {
    const getFormats = Wreck.get(`http://${movieApiHost}/formats`, { json: true })
    const getMovie = Wreck.get(`http://${movieApiHost}/movies/${request.params.id}`, {
      json: true
    })
    const [movie, formats] = await Promise.all([getMovie, getFormats])

    return h.response(adminMovieEditTemplate.stream({
      movie: movie.payload.data.movie,
      formats: formats.payload.data.formats
    })).type('text/html').code(200)
  } catch (err) {
    return err.statusCode === 401 ? h.redirect('/admin/login') : err
  }
}
