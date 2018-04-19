import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  Redirect
} from 'react-router-dom'

import {
  Form,
  Input,
  Icon,
  Button,
  Spin,
  Divider,
} from 'antd';
const FormItem = Form.Item;

class UserForm extends Component {
  static propTypes = {
    session: PropTypes.string.isRequired,
    userId: PropTypes.string
  }

  static defaultProps = {
    userId: ''
  }
  
  state = {
    user: null,
    isLoading: false,
    userAdded: false,
  }

  componentDidMount() {
    if (this.props.userId) {
      this.getUser(this.props.userId);
    }
  }

  getUser = async (userId) => {
    try {
      this.setState({
        isLoading: true,
      })

      const { data } = await axios.get(`/api/users/${userId}`)
      const { user } = data.data

      this.setState({
        user,
        isLoading: false,
      })
    } catch (e) {
      console.log('error >>> ', e)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {
      session,
      userId
    } = this.props
    const isEdit = userId !== ''
    const method = isEdit ? 'put' : 'post'
    const url = isEdit ? `/api/users/${userId}` : '/api/users'

    this.props.form.validateFieldsAndScroll(async (err, data) => {
      if (!err) {
        this.setState({
          isLoading: true,
        })

        try {
          const response = await axios({
            method,
            url,
            data,
            headers: {
              'Authorization': session
            }
          })
  
          this.setState({
            userAdded: true,
          })
        } catch (e) {
          console.log('user error >>> ', e)
          this.setState({
            isLoading: false,
          })
        }
      }
    });
  }

  render() {
    const {
      form,
      userId
    } = this.props
    const { getFieldDecorator } = form;

    const {
      user,
      isLoading,
      userAdded
    } = this.state

    const isEdit = userId !== '' && user
    const titleContext = isEdit ? 'Edit User' : 'Add User'

    if (userAdded) {
      return (
        <Redirect push to="/admin/users"/>
      )
    }

    if (isLoading) {
      return (
        <Spin size="large" />
      )
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <h3>{titleContext}</h3>
        
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input an email!' }],
            initialValue: isEdit ? user.email : null
          })(
            <Input placeholder="email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input a password!' }]
          })(
            <Input type="password" placeholder="password" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(UserForm);
