import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import {
  Row,
  Button,
  Table,
  Divider,
  Spin
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

  render () {
    const {
      session
    } = this.props

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
              <span>
                <a href="javascript:;">Edit</a>
                <Divider type="vertical" />
                <a href="javascript:;">Delete</a>
                <Divider type="vertical" />
              </span>
            )}
          />
        </Table>

        <Button type='primary'><Link to='/admin/movies/add'>Add Movie</Link></Button>
      </Row>
    )
  }
}
