'use strict'

const indexTemplate = require('../views/index')
module.exports = async (request, h) => {
  const html = indexTemplate.stream({})

  return h.response(html)
    .type('text/html')
    .code(200)
}
