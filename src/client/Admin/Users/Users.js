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

export default class Users extends Component {
  static propTypes = {
    session: PropTypes.string.isRequired
  }
  
  state = {
    users: [],
    isLoading: true,
  }

  componentDidMount = () => {
    this.getUsers();
  }

  getUsers = async () => {
    try {
      this.setState({
        isLoading: true,
      })

      const { data } = await axios.get('/api/users', {
        headers: {
          'Authorization': this.props.session
        }
      });
      const { users } = data.data;

      this.setState({
        users,
        isLoading: false,
      })
    } catch (e) {
      console.log('error >>> ', e);
    }
  }

  handleUserDelete = user => async () => {
    try {
      const response = await axios.delete(`/api/users/${user._id}`, {
        headers: {
          'Authorization': this.props.session
        }
      })

      this.getUsers();
    } catch (e) {
      console.log('error >>> ', e);
    }
  }

  render () {
    const {
      isLoading,
      users,
    } = this.state

    if (isLoading) {
      return (
        <Spin size="large" />
      )
    }

    return (
      <Row>
        <Table dataSource={users}>
          <Column
            title="Email"
            dataIndex="email"
            key="email"
          />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Button.Group>
                <Button type="primary">
                  <Link to={`/admin/users/edit/${record._id}`}><Icon type="edit" />Edit</Link>
                </Button>
                <Button type="danger">
                  <Popconfirm
                    title="Are you sure delete this User?"
                    onConfirm={this.handleUserDelete(record)}
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

        <Button type='primary'><Link to='/admin/users/add'>Add User</Link></Button>
      </Row>
    )
  }
}
