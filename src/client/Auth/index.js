import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  Redirect
} from 'react-router-dom'

import {
  Form,
  Input,
  Button,
  Spin,
  Divider,
  Icon
} from 'antd'
const FormItem = Form.Item

class LoginForm extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired
  }

  state = {
    isLoading: false,
    isLoggedIn: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        this.setState({
          isLoading: true,
        })

        try {
          const response = await fetch('/api/auth', {
            body: JSON.stringify(values),
            headers: {
              'content-type': 'application/json'
            },
            method: 'POST',
            credentials: 'same-origin'
          })
          const { token } = await response.json()

          this.props.onLogin(token);
          this.setState({
            isLoggedIn: true,
          })
        } catch (e) {
          console.log('add movie error >>> ', e)

          this.setState({
            isLoading: false,
          })
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const {
      isLoading,
      isLoggedIn
    } = this.state

    if (isLoggedIn) {
      return (
        <Redirect push to="/admin"/>
      )
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please enter an email' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="email"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Please enter a password' },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="password"
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(LoginForm);
