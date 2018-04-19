'use strict'
require('marko/node-require')

const indexHandler = require('./handlers/index')

const Hapi = require('hapi')
const server = Hapi.Server({
  port: process.env.PORT || 8080
})
const Inert = require('inert')
const h2o2 = require('h2o2')
const url = require('url')

const movieApiHost = process.env.movie_api_host || 'api:8080'

/**
 * Takes a URL object and removes the API path
 * @param {Object} url the URL object to format
 * @return {Object} the formatted URL object
 */
function formatApiUrl (url) {
  const apiPath = '/api'
  const newUrl = url

  newUrl.pathname = newUrl.pathname.replace(apiPath, '')
  newUrl.path = newUrl.path.replace(apiPath, '')
  newUrl.href = newUrl.href.replace(apiPath, '')
  newUrl.host = movieApiHost
  newUrl.hostname = movieApiHost
  newUrl.protocol = 'http'

  return newUrl
}

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
          mapUri: request => {
            const newUrl = formatApiUrl(request.url)
            newUrl.query = request.query || {}

            return {
              uri: url.format(newUrl)
            }
          },
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
