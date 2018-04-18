import React, { Component } from 'react'
import {
  Row,
  Button,
  Table,
  Divider
} from 'antd'

const { Column, ColumnGroup } = Table;

import {
  Route,
  Link
} from 'react-router-dom'

export default class Movies extends Component {
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
