'use strict'
require('marko/node-require')

const indexHandler = require('./handlers/index')
const moviesHandler = require('./handlers/movies')
const formatsHandler = require('./handlers/formats')
const loginIndexHandler = require('./handlers/login/index')
const loginPostHandler = require('./handlers/login/login')
const adminMoviesHandler = require('./handlers/admin/movies/index')
const adminMovieHandler = require('./handlers/admin/movies/movie')
const adminMovieAddHandler = require('./handlers/admin/movies/add')
const adminMovieUpdateHandler = require('./handlers/admin/movies/update')
const adminMovieDeleteHandler = require('./handlers/admin/movies/delete')
const adminFormatsHandler = require('./handlers/admin/formats/index')
const adminFormatHandler = require('./handlers/admin/formats/format')
const adminFormatAddHandler = require('./handlers/admin/formats/add')
const adminFormatUpdateHandler = require('./handlers/admin/formats/update')
const adminFormatDeleteHandler = require('./handlers/admin/formats/delete')
const adminUsersHandler = require('./handlers/admin/users/index')
const adminUserHandler = require('./handlers/admin/users/user')
const adminUserAddHandler = require('./handlers/admin/users/add')
const adminUserUpdateHandler = require('./handlers/admin/users/update')
const adminUserDeleteHandler = require('./handlers/admin/users/delete')
const adminMatchTMDB = require('./handlers/admin/match-tmdb')

const Hapi = require('hapi')
const server = Hapi.Server({
  port: process.env.PORT || 8080
})
const Inert = require('inert')

const movieApiHost = process.env.movie_api_host || 'api:8080'

server.register([{
  plugin: Inert
}])
  .then(() => {
    // serve up all static content in public folder
    server.app.movieApiHost = movieApiHost

    server.route({
      method: 'GET',
      path: '/static/{param*}',
      handler: {
        directory: {
          path: `${__dirname}/../../dist`,
          listing: true
        }
      }
    })

    server.route({
      method: 'GET',
      path: '/',
      options: {
        handler: indexHandler
      }
    })

    server.route({
      method: 'GET',
      path: '/movies',
      options: {
        handler: moviesHandler
      }
    })

    server.route({
      method: 'GET',
      path: '/formats',
      options: {
        handler: formatsHandler
      }
    })

    server.route({
      method: 'GET',
      path: '/admin/login',
      options: {
        handler: loginIndexHandler
      }
    })

    server.state('mcsession', {
      ttl: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      isSecure: false,
      encoding: 'none'
    })

    server.route({
      method: 'POST',
      path: '/admin/login',
      options: {
        handler: loginPostHandler
      }
    })

    server.route({
      method: 'GET',
      path: '/admin/movies',
      options: {
        handler: adminMoviesHandler
      }
    })

    server.route({
      method: 'POST',
      path: '/admin/movies',
      options: {
        handler: adminMovieAddHandler
      }
    })

    server.route({
      method: 'GET',
      path: '/admin/movies/{id}',
      options: {
        handler: adminMovieHandler
      }
    })

    server.route({
      method: 'PUT',
      path: '/admin/movies/{id}',
      options: {
        handler: adminMovieUpdateHandler
      }
    })

    server.route({
      method: 'DELETE',
      path: '/admin/movies/{id}',
      options: {
        handler: adminMovieDeleteHandler
      }
    })

    server.route({
      method: 'GET',
      path: '/admin/formats',
      options: {
        handler: adminFormatsHandler
      }
    })

    server.route({
      method: 'GET',
      path: '/admin/formats/{id}',
      options: {
        handler: adminFormatHandler
      }
    })

    server.route({
      method: 'POST',
      path: '/admin/formats',
      options: {
        handler: adminFormatAddHandler
      }
    })

    server.route({
      method: 'PUT',
      path: '/admin/formats/{id}',
      options: {
        handler: adminFormatUpdateHandler
      }
    })

    server.route({
      method: 'DELETE',
      path: '/admin/formats/{id}',
      options: {
        handler: adminFormatDeleteHandler
      }
    })

    server.route({
      method: 'GET',
      path: '/admin/users',
      options: {
        handler: adminUsersHandler
      }
    })

    server.route({
      method: 'GET',
      path: '/admin/users/{id}',
      options: {
        handler: adminUserHandler
      }
    })

    server.route({
      method: 'POST',
      path: '/admin/users',
      options: {
        handler: adminUserAddHandler
      }
    })

    server.route({
      method: 'PUT',
      path: '/admin/users/{id}',
      options: {
        handler: adminUserUpdateHandler
      }
    })

    server.route({
      method: 'DELETE',
      path: '/admin/users/{id}',
      options: {
        handler: adminUserDeleteHandler
      }
    })

    server.route({
      method: 'GET',
      path: '/admin/match-tmdb',
      options: {
        handler: adminMatchTMDB
      }
    })
  })
  .then(() => server.start())
  .then(() => console.log(`Server running at: ${server.info.uri}`))
  .catch((err) => console.log(err))
