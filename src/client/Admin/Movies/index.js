import React, { Component } from 'react'
import {
  Row,
  Button,
  Divider,
  Table,
} from 'antd'

const { Column, ColumnGroup } = Table;

import {
  Route,
  Link
} from 'react-router-dom'

import Movies from './Movies'
import AddMovie from './Add'

export default class AdminMovies extends Component {
  state = {
    movies: [],
    isLoading: true,
  }

  componentDidMount = () => {
    this.getMovies();
  }

  getMovies = async () => {
    try {
      const response = await fetch('/movies');
      const movies = await response.json();

      this.setState({
        movies,
        isLoading: false,
      })
    } catch (e) {
      console.log('error >>> ', e);
    }
  }

  render () {
    const {
      isLoading,
      movies,
    } = this.state

    return (
      <Row>
        <br />
        Manage movies
        <Divider />

        <Route exact path='/admin/movies' component={Movies} /> 
        <Route exact path='/admin/movies/add' component={AddMovie} />
      </Row>
    )
  }
}
