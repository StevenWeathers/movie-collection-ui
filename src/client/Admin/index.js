import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Row,
  Menu
} from 'antd'

import {
  Route,
  Link
} from 'react-router-dom'

import AdminMovies from './Movies/index'
import AdminFormats from './Formats/index'
import AdminUsers from './Users/index'

export default class Admin extends Component {
  static propTypes = {
    session: PropTypes.string.isRequired
  }

  render () {
    const {
      session
    } = this.props

    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Menu
          mode='horizontal'
        >
          <Menu.Item key='movies'>
            <Link to='/admin/movies'>Movies</Link>
          </Menu.Item>
          <Menu.Item key='formats'>
            <Link to='/admin/formats'>Formats</Link>
          </Menu.Item>
          <Menu.Item key='users'>
            <Link to='/admin/users'>Users</Link>
          </Menu.Item>
        </Menu>

        <Route path='/admin/movies' render={() => (
          <AdminMovies
            session={session}
          />
        )}/>
        <Route path='/admin/formats' render={() => (
          <AdminFormats
            session={session}
          />
        )}/>
        <Route path='/admin/users' render={() => (
          <AdminUsers
            session={session}
          />
        )}/>
      </Row>
    )
  }
}
