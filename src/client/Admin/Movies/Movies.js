import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import {
  Row,
  Button,
  Table,
  Divider,
  Spin,
  Icon
} from 'antd'

const { Column, ColumnGroup } = Table;

import {
  Route,
  Link
} from 'react-router-dom'

export default class Movies extends Component {
  static propTypes = {
    session: PropTypes.string.isRequired
  }
  
  state = {
    movies: [],
    isLoading: true,
  }

  componentDidMount = () => {
    this.getMovies();
  }

  getMovies = async () => {
    this.setState({
      isLoading: true,
    })

    try {
      const { data } = await axios.get('/api/movies');
      const { movies } = data.data;

      this.setState({
        movies,
        isLoading: false,
      })
    } catch (e) {
      console.log('error >>> ', e);
    }
  }

  handleMovieDelete = movie => async () => {
    try {
      const response = await axios.delete(`/api/movies/${movie._id}`, {
        headers: {
          'Authorization': this.props.session
        }
      })

      this.getMovies();
    } catch (e) {
      console.log('error >>> ', e);
    }
  }

  render () {
    const {
      isLoading,
      movies,
    } = this.state

    if (isLoading) {
      return (
        <Spin size="large" />
      )
    }

    return (
      <Row>
        <Table dataSource={movies}>
          <Column
            title="Title"
            dataIndex="title"
            key="title"
          />
          <Column
            title="Format"
            dataIndex="format"
            key="format"
          />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Button.Group>
                <Button type="primary">
                  <Link to={`/admin/movies/edit/${record._id}`}><Icon type="edit" />Edit</Link>
                </Button>
                <Button type="danger" onClick={this.handleMovieDelete(record)}>
                  <Icon type="delete" />Delete
                </Button>
              </Button.Group>
            )}
          />
        </Table>

        <Button type='primary'><Link to='/admin/movies/add'>Add Movie</Link></Button>
      </Row>
    )
  }
}
