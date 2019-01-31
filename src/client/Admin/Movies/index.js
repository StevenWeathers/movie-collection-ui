import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Divider
} from 'antd'

import {
  Route
} from 'react-router-dom'

import Movies from './Movies'
import MovieForm from './Form'

export default class AdminMovies extends Component {
  static propTypes = {
    session: PropTypes.string.isRequired
  }

  render () {
    const {
      session
    } = this.props

    return (
      <Row>
        <br />
        <h1>Manage movies</h1>
        <Divider />

        <Route exact path='/admin/movies' render={() => (
          <Movies
            session={session}
          />
        )}/>
        <Route path='/admin/movies/:movieTitle' render={({ match }) => (
          <Movies
            session={session}
            movieTitle={match.params.movieTitle}
          />
        )} />
        <Route exact path='/admin/movies/add' render={() => (
          <MovieForm
            session={session}
          />
        )}/>
        <Route exact path='/admin/movies/edit/:movieId' render={({ match }) => (
          <MovieForm
            session={session}
            movieId={match.params.movieId}
          />
        )}/>
      </Row>
    )
  }
}
