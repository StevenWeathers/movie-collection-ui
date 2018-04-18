import React, { Component } from 'react'
import {
  Row,
  Menu,
  Icon
} from 'antd'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import AdminMovies from './Movies'
import AdminFormats from './Formats'
import AdminUsers from './Users'

export default class AdminDashboard extends Component {
  render () {
    return (
      <Row gutter={16}>
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

        <Route exact path='/admin/movies' component={AdminMovies} />
        <Route exact path='/admin/formats' component={AdminFormats} />
        <Route exact path='/admin/users' component={AdminUsers} />
      </Row>
    )
  }
}
