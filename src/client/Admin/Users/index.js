import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Divider
} from 'antd'

import {
  Route
} from 'react-router-dom'

import Users from './Users'
import UserForm from './Form'

export default class AdminUsers extends Component {
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
        <h1>Manage Users</h1>
        <Divider />
        <Route exact path='/admin/users' render={({ history }) => (
          <Users
            session={session}
            history={history}
          />
        )}/>
        <Route exact path='/admin/users/add' render={({ history }) => (
          <UserForm
            session={session}
            history={history}
          />
        )}/>
        <Route exact path='/admin/users/edit/:formatId' render={({ match, history }) => (
          <UserForm
            session={session}
            userId={match.params.userId}
            history={history}
          />
        )}/>
      </Row>
    )
  }
}
