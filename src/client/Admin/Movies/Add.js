import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  Redirect
} from 'react-router-dom'

import {
  Row,
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Col,
  Button,
  Spin,
  Divider,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class AddMovieForm extends Component {
  static propTypes = {
    session: PropTypes.string.isRequired
  }
  
  state = {
    formats: [],
    isLoading: true,
    movieAdded: false,
  }

  componentDidMount() {
    this.getFormats();
  }

  getFormats = async () => {
    try {
      const { data } = await axios.get('/api/formats')
      const { formats } = data.data

      this.setState({
        formats,
        isLoading: false,
      })
    } catch (e) {
      console.log('error >>> ', e)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        this.setState({
          isLoading: true,
        })

        try {
          const response = await axios.post('/api/movies', values, {
            headers: {
              'Authorization': this.props.session
            }
          })
  
          this.setState({
            movieAdded: true,
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
    const {
      form
    } = this.props

    const { getFieldDecorator } = form;

    const {
      isLoading,
      formats,
      movieAdded
    } = this.state

    if (movieAdded) {
      return (
        <Redirect push to="/admin/movies"/>
      )
    }

    if (isLoading) {
      return (
        <Spin size="large" />
      )
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Divider />
        <h3>Add Movie</h3>
        <FormItem>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input a Movie Title!' }],
          })(
            <Input placeholder="Title" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('year', {
            rules: [
              { required: true, message: 'Please input a Movie Year' },
              { pattern: /(?:19|20)\d{2}/, message: 'Please enter a valid year e.g. 2018' }
            ],
          })(
            <Input placeholder="Year" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('upc', {
            rules: [{ required: true, message: 'Please input a Movie UPC' }],
          })(
            <Input placeholder="UPC" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('tmdb_id', {
            rules: [{ required: true, message: 'Please input a Movie TMDB ID' }],
          })(
            <Input placeholder="TMDB ID" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('tmdb_image_url', {
            rules: [{ required: true, message: 'Please input a Movie TMDB Image URL' }],
          })(
            <Input placeholder="TMDB Image URL" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('format', {
            rules: [{ required: true, message: 'Please select a Movie Format' }],
            initialValue: formats[0].title,
          })(
            <Select>
              {
                formats.map(format => (
                  <Option value={format.title} key={format.title}>{format.title}</Option>
                ))
              }
            </Select>
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

export default Form.create()(AddMovieForm);
