"use strict";

const admingLoginTemplate = require('../../views/admin/login');

module.exports = (request, h) => {
  return h.response(admingLoginTemplate.stream({})).type('text/html').code(200);
};
