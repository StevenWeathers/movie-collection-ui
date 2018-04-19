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
              <span>
                <a href="javascript:;">Edit</a>
                <Divider type="vertical" />
                <a href="javascript:;">Delete</a>
                <Divider type="vertical" />
              </span>
            )}
          />
        </Table>

        <Button type='primary'><Link to='/admin/users/add'>Add User</Link></Button>
      </Row>
    )
  }
}
