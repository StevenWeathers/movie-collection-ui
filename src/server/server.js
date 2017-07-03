"use strict";
require('marko/node-require');

const indexTemplate = require('./views/index');
const admingLoginTemplate = require('./views/admin/login');
const adminMoviesTemplate = require('./views/admin/movies');
const adminMovieEditTemplate = require('./views/admin/editmovie');
const adminFormatsTemplate = require('./views/admin/formats');
const adminUsersTemplate = require('./views/admin/users');

const Hapi = require("hapi");
const server = new Hapi.Server();
const Wreck = require('wreck');
const movieApiHost = process.env.movie_api_host || "api:8080";

server.connection({
  port: process.env.PORT || 8080
});

const plugins = [
  require('inert')
];

server.register(plugins, err => {
  if (err) {
    throw err;
  }

  // serve up all static content in public folder
  server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
      directory: {
        path: `${__dirname}/../client`
      }
    }
  });

  server.route({
    method: "GET",
    path:"/",
    config: {
      handler: (request, reply) => {
        return Wreck.get(`http://${movieApiHost}/movies`, {json: true}, (err, res, payload) => {
          if(!err) {
            return reply(indexTemplate.stream({
              movies: payload.data.movies
            })).type('text/html');
          } else {
            return reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: "GET",
    path:"/admin/login",
    config: {
      handler: (request, reply) => {
        return reply(admingLoginTemplate.stream({})).type('text/html');
      }
    }
  });

  server.state('mcsession', {
      ttl: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      isSecure: false,
      encoding: 'none'
  });

  server.route({
    method: "POST",
    path:"/admin/login",
    config: {
      handler: (request, reply) => {
        const { email, password } = request.payload;

        return Wreck.post(`http://${movieApiHost}/auth`, { json: true, payload: { email, password } }, (err, res, payload) => {
          if(!err) {
            return reply().state('mcsession', payload.token).redirect("/admin/movies");
          } else {
            return err.statusCode === 401 ? reply().redirect("/admin/login") : reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: "GET",
    path:"/admin/movies",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        // Need to GET formats from API along with Movies

        return Wreck.get(`http://${movieApiHost}/movies`, {json: true}, (err, res, payload) => {
          if(!err) {
            return reply(adminMoviesTemplate.stream({
              movies: payload.data.movies
            })).type('text/html');
          } else {
            return err.statusCode === 401 ? reply().redirect("/admin/login") : reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: "POST",
    path:"/admin/movies",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }
        const movie = request.payload;

        return Wreck.post(`http://${movieApiHost}/movies`, {
          json: true,
          payload: movie,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          if(!err) {
            return reply().redirect("/admin/movies");
          } else {
            return err.statusCode === 401 ? reply().redirect("/admin/login") : reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: "GET",
    path:"/admin/movies/{id}",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return Wreck.get(`http://${movieApiHost}/movies/${request.params.id}`, {
          json: true
        }, (err, res, payload) => {
          if(!err) {
            return reply(adminMovieEditTemplate.stream({
              movie: payload.data.movie
            })).type('text/html');
          } else {
            return err.statusCode === 401 ? reply().redirect("/admin/login") : reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: "DELETE",
    path:"/admin/movies/{id}",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        const movieId = request.params.id;

        return Wreck.delete(`http://${movieApiHost}/movies/${movieId}`, {
          json: true,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          if(!err) {
            return reply(payload);
          } else {
            return err.statusCode === 401 ? reply().redirect("/admin/login") : reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: "GET",
    path:"/admin/formats",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return reply(adminFormatsTemplate.stream({})).type('text/html');
      }
    }
  });

  server.route({
    method: "GET",
    path:"/admin/users",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return reply(adminUsersTemplate.stream({})).type('text/html');
      }
    }
  });

  server.start(err => {

    if (err) {
      throw err;
    }

    console.log(`Server running on port: 8080`);

  });
});
