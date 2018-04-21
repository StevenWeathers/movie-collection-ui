import React, { Component } from 'react'
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

const tmdbHost = 'http://image.tmdb.org/t/p/w154'

export default class Movies extends Component {
  state = {
    isLoading: true,
    movies: [],
  }

  componentDidMount = () => {
    this.getMovies();
  }

  getMovies = async () => {
    try {
      const { data } = await axios.get('/api/movies')
      const { movies } = data.data

      this.setState({
        movies,
        isLoading: false
      })
    } catch (e) {
      console.log('error >>> ', e);
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
    )
  }
}
