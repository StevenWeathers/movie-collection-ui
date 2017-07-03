"use strict";
require('marko/node-require');

const indexTemplate = require('./views/index');
const admingLoginTemplate = require('./views/admin/login');
const adminMoviesTemplate = require('./views/admin/movies');
const adminMovieEditTemplate = require('./views/admin/editmovie');
const adminFormatsTemplate = require('./views/admin/formats');
const adminFormatEditTemplate = require('./views/admin/editformat');
const adminUsersTemplate = require('./views/admin/users');
const adminUserEditTemplate = require('./views/admin/edituser');

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
    method: "PUT",
    path:"/admin/movies/{id}",
    config: {
      handler: (request, reply) => {
        const movieId = request.params.id;

        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return Wreck.put(`http://${movieApiHost}/movies/${movieId}`, {
          json: true,
          payload: request.payload,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          console.log(payload);
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
    method: "DELETE",
    path:"/admin/movies/{id}",
    config: {
      handler: (request, reply) => {
        const movieId = request.params.id;

        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

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

        return Wreck.get(`http://${movieApiHost}/formats`, {
          json: true,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          if(!err) {
            return reply(adminFormatsTemplate.stream({
              formats: payload.data.formats
            })).type('text/html');
          } else {
            return err.statusCode === 401 ? reply().redirect("/admin/login") : reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: "GET",
    path:"/admin/formats/{id}",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return Wreck.get(`http://${movieApiHost}/formats/${request.params.id}`, {
          json: true,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          if(!err) {
            return reply(adminFormatEditTemplate.stream({
              format: payload.data.format
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
    path:"/admin/formats",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }
        const format = request.payload;

        return Wreck.post(`http://${movieApiHost}/formats`, {
          json: true,
          payload: format,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          if(!err) {
            return reply().redirect("/admin/formats");
          } else {
            return err.statusCode === 401 ? reply().redirect("/admin/login") : reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: "PUT",
    path:"/admin/formats/{id}",
    config: {
      handler: (request, reply) => {
        const formatId = request.params.id;

        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return Wreck.put(`http://${movieApiHost}/formats/${formatId}`, {
          json: true,
          payload: request.payload,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          console.log(payload);
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
    method: "DELETE",
    path:"/admin/formats/{id}",
    config: {
      handler: (request, reply) => {
        const formatId = request.params.id;

        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return Wreck.delete(`http://${movieApiHost}/formats/${formatId}`, {
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
    path:"/admin/users",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return Wreck.get(`http://${movieApiHost}/users`, {
          json: true,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          if(!err) {
            return reply(adminUsersTemplate.stream({
              users: payload.data.users
            })).type('text/html');
          } else {
            return err.statusCode === 401 ? reply().redirect("/admin/login") : reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: "GET",
    path:"/admin/users/{id}",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return Wreck.get(`http://${movieApiHost}/users/${request.params.id}`, {
          json: true,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          if(!err) {
            return reply(adminUserEditTemplate.stream({
              user: payload.data.user
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
    path:"/admin/users",
    config: {
      handler: (request, reply) => {
        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }
        const user = request.payload;

        return Wreck.post(`http://${movieApiHost}/users`, {
          json: true,
          payload: user,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          if(!err) {
            return reply().redirect("/admin/users");
          } else {
            return err.statusCode === 401 ? reply().redirect("/admin/login") : reply(err);
          }
        });
      }
    }
  });

  server.route({
    method: "PUT",
    path:"/admin/users/{id}",
    config: {
      handler: (request, reply) => {
        const userId = request.params.id;

        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return Wreck.put(`http://${movieApiHost}/users/${userId}`, {
          json: true,
          payload: request.payload,
          headers: {
            "Authorization": request.state.mcsession
          }
        }, (err, res, payload) => {
          console.log(payload);
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
    method: "DELETE",
    path:"/admin/users/{id}",
    config: {
      handler: (request, reply) => {
        const userId = request.params.id;

        if (!request.state.mcsession) {
          return reply().redirect("/admin/login");
        }

        return Wreck.delete(`http://${movieApiHost}/users/${userId}`, {
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

  server.start(err => {

    if (err) {
      throw err;
    }

    console.log(`Server running on port: 8080`);

  });
});
