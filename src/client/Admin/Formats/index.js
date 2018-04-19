import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Divider
} from 'antd'

import {
  Route
} from 'react-router-dom'

import Formats from './Formats'
import FormatForm from './Form'

export default class AdminFormats extends Component {
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
        Manage formats
        <Divider />

        <Route exact path='/admin/formats' render={() => (
          <Formats
            session={session}
          />
        )}/>
        <Route exact path='/admin/formats/add' render={() => (
          <FormatForm
            session={session}
          />
        )}/>
        <Route exact path='/admin/formats/edit/:formatId' render={({ match }) => (
          <FormatForm
            session={session}
            formatId={match.params.formatId}
          />
        )}/>
      </Row>
    )
  }
}
