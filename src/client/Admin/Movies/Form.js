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

class MovieForm extends Component {
  static propTypes = {
    session: PropTypes.string.isRequired,
    movieId: PropTypes.string
  }

  static defaultProps = {
    movieId: ''
  }
  
  state = {
    movie: null,
    formats: [],
    isLoading: true,
    movieAdded: false,
  }

  componentDidMount() {
    if (this.props.movieId) {
      this.getMovie(this.props.movieId);
    } else {
      this.getFormats();
    }
  }

  getFormats = async (setState = true) => {
    try {
      const { data } = await axios.get('/api/formats')
      const { formats } = data.data

      if (setState) {
        this.setState({
          formats,
          isLoading: false,
        })
      } else {
        return formats
      }
    } catch (e) {
      console.log('error >>> ', e)
    }
  }

  getMovie = async (movieId) => {
    try {
      const formats = await this.getFormats(false);
      const { data } = await axios.get(`/api/movies/${movieId}`)
      const { movie } = data.data

      this.setState({
        movie,
        formats,
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
      movieId
    } = this.props
    const isEdit = movieId !== ''
    const method = isEdit ? 'put' : 'post'
    const url = isEdit ? `/api/movies/${movieId}` : '/api/movies'

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
            movieAdded: true,
          })
        } catch (e) {
          console.log('movie error >>> ', e)
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
      movieId
    } = this.props
    const { getFieldDecorator } = form;

    const {
      movie,
      isLoading,
      formats,
      movieAdded
    } = this.state

    const isEdit = movieId !== '' && movie
    const titleContext = isEdit ? 'Edit Movie' : 'Add Movie'

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
        <h3>{titleContext}</h3>
        
        <FormItem>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input a Movie Title!' }],
            initialValue: isEdit ? movie.title : null
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
            initialValue: isEdit ? movie.year : null
          })(
            <Input placeholder="Year" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('upc', {
            rules: [{ required: true, message: 'Please input a Movie UPC' }],
            initialValue: isEdit ? movie.upc : null
          })(
            <Input placeholder="UPC" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('tmdb_id', {
            rules: [{ required: true, message: 'Please input a Movie TMDB ID' }],
            initialValue: isEdit ? movie.tmdb_id : null
          })(
            <Input placeholder="TMDB ID" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('tmdb_image_url', {
            rules: [{ required: true, message: 'Please input a Movie TMDB Image URL' }],
            initialValue: isEdit ? movie.tmdb_image_url : null
          })(
            <Input placeholder="TMDB Image URL" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('format', {
            rules: [{ required: true, message: 'Please select a Movie Format' }],
            initialValue: isEdit ? movie.format : formats[0].title
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

export default Form.create()(MovieForm);
