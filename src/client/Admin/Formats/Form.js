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

class FormatForm extends Component {
  static propTypes = {
    session: PropTypes.string.isRequired,
    formatId: PropTypes.string
  }

  static defaultProps = {
    formatId: ''
  }
  
  state = {
    format: null,
    isLoading: false,
    formatAdded: false,
  }

  componentDidMount() {
    if (this.props.formatId) {
      this.getFormat(this.props.formatId)
    }
  }

  getFormat = async (formatId) => {
    try {
      this.setState({
        isLoading: true,
      })

      const { data } = await axios.get(`/api/formats/${formatId}`)
      const { format } = data.data

      this.setState({
        format,
        isLoading: false,
      })
    } catch (e) {
      this.handleApiError(e)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {
      session,
      formatId
    } = this.props
    const isEdit = formatId !== ''
    const method = isEdit ? 'put' : 'post'
    const url = isEdit ? `/api/formats/${formatId}` : '/api/formats'

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
            formatAdded: true,
          })
        } catch (e) {
          this.setState({
            isLoading: false,
          })
          this.handleApiError(e)
        }
      }
    });
  }

  handleApiError = (error) => {
    if (error.message && error.message.includes('code 401')) {
      this.props.history.push('/logout')
    } else {
      message.error(`Woops, looks like something went wrong.  Perhaps try again?`);
    }
  }

  render() {
    const {
      form,
      formatId
    } = this.props
    const { getFieldDecorator } = form

    const {
      format,
      isLoading,
      formatAdded
    } = this.state

    const isEdit = formatId !== '' && format
    const titleContext = isEdit ? 'Edit Format' : 'Add Format'

    if (formatAdded) {
      return (
        <Redirect push to="/admin/formats"/>
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
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input a Format Title!' }],
            initialValue: isEdit ? format.title : null
          })(
            <Input placeholder="Title" />
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

export default Form.create()(FormatForm);
