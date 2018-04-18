import React, { Component } from 'react'
import {
  Card,
  Row,
  Col,
  Spin
} from 'antd'

import {
  Link
} from 'react-router-dom'

const tmdbHost = 'http://image.tmdb.org/t/p/w154'

export default class Movies extends Component {
  state = {
    movies: [],
  }

  componentDidMount = () => {
    this.getMovies();
  }

  getMovies = async () => {
    try {
      const response = await fetch('/api/movies');
      const { data } = await response.json();

      this.setState({
        movies: data.movies,
      })
    } catch (e) {
      console.log('error >>> ', e);
    }
  }

  render () {
    const {
      movies
    } = this.state

    if (isLoading) {
      return (
        <Spin size="large" />
      )
    }

    return (
      <Row gutter={16}>
        {
          movies.map(({
            title,
            tmdb_image_url,
            slug
          }) => (
            <Col
              span={6}
              key={slug}
            >
              <Card

                title={title} extra={<Link to={`/movie/${slug}`}>View</Link>}>
                <img src={`${tmdbHost}${tmdb_image_url}`} />
              </Card>
            </Col>
          ))
        }
      </Row>
    )
  }
}
