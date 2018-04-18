import React, { Component } from 'react'
import {
  Row,
  Divider
} from 'antd'

export default class AdminFormats extends Component {
  render () {
    return (
      <Row gutter={16}>
        <br />
        Manage Formats
        <Divider />
      </Row>
    )
  }
}
