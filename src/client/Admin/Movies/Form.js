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
  Select,
  Button,
  Spin,
  Divider,
  Row,
  Col,
  Card
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const tmdbHost = 'http://image.tmdb.org/t/p/w154'

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
    tmdbResults: [],
    tmdbInfo: {
      year: null,
      tmdb_id: null,
      tmdb_image_url: null
    },
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
      this.handleApiError(e)
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
      this.handleApiError(e)
    }
  }

  onTitleBlur = async (e) => {
    e.preventDefault()
    const title = e.target.value

    try {
      const { data } = await axios.get(`/api/match-tmdb?title=${title}`)
      const { results } = data

      this.setState({
        tmdbResults: results,
      })
    } catch (e) {
      this.handleApiError(e)
    }
  }

  onTmdbClick = result => () => {
    const {
      release_date,
      id,
      poster_path
    } = result

    const tmdbInfo = {
      year: release_date.substr(0, 4),
      tmdb_id: `${id}`,
      tmdb_image_url: poster_path
    }
    
    this.setState({
      tmdbInfo
    })
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
      movieId
    } = this.props
    const { getFieldDecorator } = form;

    const {
      movie,
      isLoading,
      formats,
      movieAdded,
      tmdbResults,
      tmdbInfo
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
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
        >
          <Form onSubmit={this.handleSubmit}>
            <h3>{titleContext}</h3>
            
            <FormItem>
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input a Movie Title!' }],
                initialValue: isEdit ? movie.title : null
              })(
                <Input placeholder="Title" onBlur={this.onTitleBlur} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('year', {
                rules: [
                  { required: true, message: 'Please input a Movie Year' },
                  { pattern: /(?:19|20)\d{2}/, message: 'Please enter a valid year e.g. 2018' }
                ],
                initialValue: isEdit ? movie.year : tmdbInfo.year
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
                initialValue: isEdit ? movie.tmdb_id : tmdbInfo.tmdb_id
              })(
                <Input placeholder="TMDB ID" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('tmdb_image_url', {
                rules: [{ required: true, message: 'Please input a Movie TMDB Image URL' }],
                initialValue: isEdit ? movie.tmdb_image_url : tmdbInfo.tmdb_image_url
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
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
        >
          <h2>TMDB Results</h2>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {
              tmdbResults.map((result) => {
                const {
                  title,
                  release_date,
                  poster_path,
                  id
                } = result

                return (
                  <Col
                    xs={24}
                    sm={12}
                    md={12}
                    lg={8}
                    xl={6}
                    key={id}
                  >
                    <Card
                      cover={<img src={`${tmdbHost}${poster_path}`} style={{ maxWidth: '100%' }} />}
                    >
                      <h2>{title}</h2>
                      <h3>{release_date.substr(0, 4)}</h3><br />
                      <Button type="primary" onClick={this.onTmdbClick(result)} style={{ width: '100%' }}>
                        Select
                      </Button>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        </Col>
      </Row>
    )
  }
}

export default Form.create()(MovieForm);
