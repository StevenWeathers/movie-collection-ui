'use strict';

const adminFormatEditTemplate = require('../../../views/admin/editformat')
const Wreck = require('wreck')

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect('/admin/login')
  }
  const movieApiHost = request.server.app.movieApiHost

  try {
    const { payload } = await Wreck.get(`http://${movieApiHost}/formats/${request.params.id}`, {
      json: true,
      headers: {
        'Authorization': request.state.mcsession
      }
    })

    return h.response(adminFormatEditTemplate.stream({
      format: payload.data.format
    })).type('text/html').code(200)
  } catch (err) {
    return err.statusCode === 401 ? h.redirect('/admin/login') : err
  }
}
