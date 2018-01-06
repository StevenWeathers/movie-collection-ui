"use strict";
require('marko/node-require');


const adminMovieEditTemplate = require('./views/admin/editmovie');
const adminFormatsTemplate = require('./views/admin/formats');
const adminFormatEditTemplate = require('./views/admin/editformat');
const adminUsersTemplate = require('./views/admin/users');
const adminUserEditTemplate = require('./views/admin/edituser');

const Hapi = require("hapi");
const server = Hapi.Server({
  port: process.env.PORT || 8080
});
const Inert = require('inert');
const Wreck = require("wreck");
const movieApiHost = process.env.movie_api_host || "api:8080";

server.register([{
  plugin: Inert
}])
  .then(() => {
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
      path: "/",
      options: {
        handler: require('./handlers/index')
      }
    });

    server.route({
      method: "GET",
      path: "/admin/login",
      options: {
        handler: require('./handlers/login/index')
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
      path: "/admin/login",
      options: {
        handler: require('./handlers/login/login')
      }
    });

    server.route({
      method: "GET",
      path: "/admin/movies",
      options: {
        handler: require('./handlers/admin/movies/index')
      }
    });

    server.route({
      method: "POST",
      path: "/admin/movies",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }
          const movie = request.payload;

          try {
            const { payload } = await Wreck.post(`http://${movieApiHost}/movies`, {
              json: true,
              payload: movie,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.redirect("/admin/movies");
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "GET",
      path: "/admin/movies/{id}",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }

          try {
            const getFormats = Wreck.get(`http://${movieApiHost}/formats`, { json: true });
            const getMovie = Wreck.get(`http://${movieApiHost}/movies/${request.params.id}`, {
              json: true
            });
            const [movie, formats] = await Promise.all([getMovie, getFormats]);

            return h.response(adminMovieEditTemplate.stream({
              movie: movie.payload.data.movie,
              formats: formats.payload.data.formats
            })).type('text/html').code(200);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "PUT",
      path: "/admin/movies/{id}",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }
          const movieId = request.params.id;

          try {
            const { payload } = await Wreck.put(`http://${movieApiHost}/movies/${movieId}`, {
              json: true,
              payload: request.payload,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.response(payload);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "DELETE",
      path: "/admin/movies/{id}",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }
          const movieId = request.params.id;

          try {
            const { payload } = await Wreck.delete(`http://${movieApiHost}/movies/${movieId}`, {
              json: true,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.response(payload);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "GET",
      path: "/admin/formats",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }

          try {
            const { payload } = await Wreck.get(`http://${movieApiHost}/formats`, {
              json: true,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.response(adminFormatsTemplate.stream({
              formats: payload.data.formats
            })).type('text/html').code(200);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "GET",
      path: "/admin/formats/{id}",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }

          try {
            const { payload } = await Wreck.get(`http://${movieApiHost}/formats/${request.params.id}`, {
              json: true,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.response(adminFormatEditTemplate.stream({
              format: payload.data.format
            })).type('text/html').code(200);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "POST",
      path: "/admin/formats",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }
          const format = request.payload;

          try {
            const { payload } = await Wreck.post(`http://${movieApiHost}/formats`, {
              json: true,
              payload: format,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.redirect("/admin/formats");
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "PUT",
      path: "/admin/formats/{id}",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }
          const formatId = request.params.id;

          try {
            const { payload } = await Wreck.put(`http://${movieApiHost}/formats/${formatId}`, {
              json: true,
              payload: request.payload,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.response(payload);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "DELETE",
      path: "/admin/formats/{id}",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }
          const formatId = request.params.id;

          try {
            const { payload } = await Wreck.delete(`http://${movieApiHost}/formats/${formatId}`, {
              json: true,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.response(payload);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "GET",
      path: "/admin/users",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }

          try {
            const { payload } = await Wreck.get(`http://${movieApiHost}/users`, {
              json: true,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.response(adminUsersTemplate.stream({
              users: payload.data.users
            })).type('text/html').code(200);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "GET",
      path: "/admin/users/{id}",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }

          try {
            const { payload } = await Wreck.get(`http://${movieApiHost}/users/${request.params.id}`, {
              json: true,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.response(adminUserEditTemplate.stream({
              user: payload.data.user
            })).type('text/html').code(200);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "POST",
      path: "/admin/users",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }
          const user = request.payload;

          try {
            const { payload } = await Wreck.post(`http://${movieApiHost}/users`, {
              json: true,
              payload: user,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.redirect("/admin/users");
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "PUT",
      path: "/admin/users/{id}",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }
          const userId = request.params.id;

          try {
            const { payload } = await Wreck.put(`http://${movieApiHost}/users/${userId}`, {
              json: true,
              payload: request.payload,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.response(payload);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });

    server.route({
      method: "DELETE",
      path: "/admin/users/{id}",
      options: {
        handler: async (request, h) => {
          if (!request.state.mcsession) {
            return h.redirect("/admin/login");
          }
          const userId = request.params.id;

          try {
            const { payload } = await Wreck.delete(`http://${movieApiHost}/users/${userId}`, {
              json: true,
              headers: {
                "Authorization": request.state.mcsession
              }
            });

            return h.response(payload);
          } catch (err) {
            return err.statusCode === 401 ? h.redirect("/admin/login") : err;
          }
        }
      }
    });
  })
  .then(() => server.start())
  .then(() => console.log(`Server running at: ${server.info.uri}`))
  .catch((err) => console.log(err));
