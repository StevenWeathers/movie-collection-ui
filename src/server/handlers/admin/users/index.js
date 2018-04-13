'use strict';

const adminUsersTemplate = require('../../../views/admin/users')
const Wreck = require('wreck')

module.exports = async (request, h) => {
  if (!request.state.mcsession) {
    return h.redirect('/admin/login')
  }
  const movieApiHost = request.server.app.movieApiHost

  try {
    const { payload } = await Wreck.get(`http://${movieApiHost}/users`, {
      json: true,
      headers: {
        'Authorization': request.state.mcsession
      }
    })

    return h.response(adminUsersTemplate.stream({
      users: payload.data.users
    })).type('text/html').code(200)
  } catch (err) {
    return err.statusCode === 401 ? h.redirect('/admin/login') : err
  }
}
