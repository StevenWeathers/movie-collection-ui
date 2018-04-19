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

const tmdbHost = 'http://image.tmdb.org/t/p/w154'

export default class Movie extends Component {
  static propTypes = {
    movieId: PropTypes.string
  }

  state = {
    isLoading: true,
    movie: {}
  }

  componentDidMount = () => {
    this.getMovie(this.props.movieId);
  }

  getMovie = async (movieId) => {
    try {
      const { data } = await axios.get(`/api/movies/${movieId}`)
      const { movie } = data.data

      this.setState({
        movie,
        isLoading: false
      })
    } catch (e) {
      console.log('error >>> ', e);
    }
  }

  render () {
    const {
      isLoading,
      movie
    } = this.state

    const {
        title,
        tmdb_image_url,
        year,
        format,
        upc
    } = movie

    if (isLoading) {
      return (
        <Spin size="large" />
      )
    }

    return (
      <Row>
        <h1>{title}</h1><br />
        <img src={`${tmdbHost}${tmdb_image_url}`} /><br />
        Year: {year}<br />
        Format: {format}<br />
        UPC: {upc}
      </Row>
    )
  }
}
