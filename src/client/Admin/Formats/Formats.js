import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  Row,
  Button,
  Table,
  Divider,
  Spin
} from 'antd'

const { Column, ColumnGroup } = Table;

import {
  Route,
  Link
} from 'react-router-dom'

export default class Formats extends Component {
  static propTypes = {
    session: PropTypes.string.isRequired
  }
  
  state = {
    formats: [],
    isLoading: true,
  }

  componentDidMount = () => {
    this.getFormats();
  }

  getFormats = async () => {
    try {
      const { data } = await axios.get('/api/formats');
      const { formats } = data.data;

      this.setState({
        formats,
        isLoading: false,
      })
    } catch (e) {
      console.log('error >>> ', e);
    }
  }

  render () {
    const {
      session
    } = this.props

    const {
      isLoading,
      formats,
    } = this.state

    if (isLoading) {
      return (
        <Spin size="large" />
      )
    }

    return (
      <Row>
        <Table dataSource={formats}>
          <Column
            title="Title"
            dataIndex="title"
            key="title"
          />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <span>
                <a href="javascript:;">Edit</a>
                <Divider type="vertical" />
                <a href="javascript:;">Delete</a>
                <Divider type="vertical" />
              </span>
            )}
          />
        </Table>

        <Button type='primary'><Link to='/admin/formats/add'>Add Format</Link></Button>
      </Row>
    )
  }
}
