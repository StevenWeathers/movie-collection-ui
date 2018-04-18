'use strict'
require('marko/node-require')

const indexHandler = require('./handlers/index')

const Hapi = require('hapi')
const server = Hapi.Server({
  port: process.env.PORT || 8080
})
const Inert = require('inert')
const h2o2 = require('h2o2')

const movieApiHost = process.env.movie_api_host || 'api:8080'

server.register([
  {
    plugin: Inert
  },
  {
    plugin: h2o2
  }
])
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
      method: '*',
      path: '/api/{params*}',
      handler: {
        proxy: {
          uri: `http://${movieApiHost}/{params}`,
          passThrough: true
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
      method: '*',
      path: '/{p*}',
      options: {
        handler: indexHandler
      }
    })
  })
  .then(() => server.start())
  .then(() => console.log(`Server running at: ${server.info.uri}`))
  .catch((err) => console.log(err))
