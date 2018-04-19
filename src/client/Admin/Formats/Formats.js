import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import {
  Row,
  Button,
  Table,
  Divider,
  Spin,
  Icon,
  Popconfirm
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
      this.setState({
        isLoading: true,
      })

      const { data } = await axios.get('/api/formats');
      const { formats } = data.data;

      this.setState({
        formats,
        isLoading: false,
      })
    } catch (e) {
      this.handleApiError(e)
    }
  }

  handleFormatDelete = format => async () => {
    try {
      const response = await axios.delete(`/api/formats/${format._id}`, {
        headers: {
          'Authorization': this.props.session
        }
      })

      this.getFormats();
    } catch (e) {
      this.handleApiError(e)
    }
  }

  handleApiError = (error) => {
    if (error.message && error.message.includes('code 401')) {
      this.props.history.push('/logout')
    } else {
      message.error(`Woops, looks like something went wrong.  Perhaps try again?`);
    }
  }

  render () {
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
              <Button.Group>
                <Button type="primary">
                  <Link to={`/admin/formats/edit/${record._id}`}><Icon type="edit" />Edit</Link>
                </Button>
                <Button type="danger">
                  <Popconfirm
                    title="Are you sure delete this Format?"
                    onConfirm={this.handleFormatDelete(record)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <a><Icon type="delete" />Delete</a>
                  </Popconfirm>
                </Button>
              </Button.Group>
            )}
          />
        </Table>

        <Button type='primary'><Link to='/admin/formats/add'>Add Format</Link></Button>
      </Row>
    )
  }
}
