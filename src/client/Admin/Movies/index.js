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
import AddMovie from './Add'

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
        Manage movies
        <Divider />

        <Route exact path='/admin/movies' render={() => (
          <Movies
            session={session}
          />
        )}/>
        <Route exact path='/admin/movies/add' render={() => (
          <AddMovie
            session={session}
          />
        )}/>
      </Row>
    )
  }
}
