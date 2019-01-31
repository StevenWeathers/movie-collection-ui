import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Row,
  Col,
  Spin
} from 'antd'
import axios from 'axios'

import {
  Link
} from 'react-router-dom'

import SearchForm from './SearchForm'

const tmdbHost = 'http://image.tmdb.org/t/p/w154'

export default class Movies extends Component {
  static propTypes = {
    movieTitle: PropTypes.string
  }

  state = {
    isLoading: true,
    movies: [],
  }

  componentDidMount = () => {
    this.getMovies()
  }

  componentDidUpdate(prevProps) {
    if(this.props.movieTitle !== prevProps.movieTitle) {
      this.getMovies()
    }
  }

  getMovies = async () => {
    const endpoint = this.props.movieTitle ? `/api/search/${encodeURIComponent(this.props.movieTitle)}` : '/api/movies'

    try {
      this.setState({
        isLoading: true
      })

      const { data } = await axios.get(endpoint)
      const { movies } = data.data

      this.setState({
        movies,
        isLoading: false
      })
    } catch (e) {
      console.log('error >>> ', e)
    }
  }

  render () {
    const {
      isLoading,
      movies
    } = this.state

    if (isLoading) {
      return (
        <Spin size="large" />
      )
    }

    return (
      <div>
        <Row type="flex" justify="center">
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={8}
            xl={8}
          >
            <SearchForm />
            {
              this.props.movieTitle &&
              <h2 style={{
                marginBottom: 20,
                textAlign: 'center'
              }}>
                Showing results for "{this.props.movieTitle}"
              </h2>
            }
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {
            movies.map(({
              title,
              tmdb_image_url,
              _id
            }) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={4}
                key={_id}
              >
                <Card
                  title={title}
                  extra={<Link to={`/movies/${_id}`}>View</Link>}
                  style={{
                    marginBottom: '2em'
                  }}
                >
                  <img
                    src={`${tmdbHost}${tmdb_image_url}`}
                    style={{
                      width: '100%'
                    }}
                  />
                </Card>
              </Col>
            ))
          }
        </Row>
      </div>
    )
  }
}
