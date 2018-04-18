import React, { Component } from 'react'
import {
  Row,
  Divider
} from 'antd'

export default class AdminUsers extends Component {
  render () {
    return (
      <Row gutter={16}>
        <br />
        Manage Users
        <Divider />
      </Row>
    )
  }
}
