import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import {
  Col,
  Row,
  Button,
  Table,
  Divider,
  Spin,
  Icon,
  Popconfirm
} from 'antd'

import SearchForm from '../../Movies/SearchForm'

const { Column, ColumnGroup } = Table;

import {
  Route,
  Link
} from 'react-router-dom'

export default class Movies extends Component {
  static propTypes = {
    session: PropTypes.string.isRequired,
    movieTitle: PropTypes.string
  }
  
  state = {
    movies: [],
    isLoading: true,
  }

  componentDidMount = () => {
    this.getMovies();
  }

  componentDidUpdate(prevProps) {
    if(this.props.movieTitle !== prevProps.movieTitle) {
      this.getMovies()
    }
  }

  getMovies = async () => {
    try {
      const endpoint = this.props.movieTitle ? `/api/search/${encodeURIComponent(this.props.movieTitle)}` : '/api/movies'

      this.setState({
        isLoading: true,
      })

      const { data } = await axios.get(endpoint)
      const { movies } = data.data

      this.setState({
        movies,
        isLoading: false,
      })
    } catch (e) {
      this.handleApiError(e)
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
      this.handleApiError(e)
    }
  }

  handleApiError = (error) => {
    if (error.message && error.message.includes('code 401')) {
      this.props.history.push('/logout')
    } else {
      message.error(`Woops, looks like something went wrong.  Perhaps try again?`);
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
      <div>
        <Row type="flex" justify="center">
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={8}
            xl={8}
          >
            <SearchForm redirectTo="admin/movies" />
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
        <Row>
          <div style={{ marginBottom: 20 }}>
            <Button type='primary'><Link to='/admin/movies/add'>Add Movie</Link></Button>
          </div>
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
                  <Button type="danger">
                    <Popconfirm
                      title="Are you sure delete this Movie?"
                      onConfirm={this.handleMovieDelete(record)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <a><Icon type="delete" />Delete</a>
                    </Popconfirm>
                  </Button>
                </Button.Group>
              )}
            />
          </Table>
        </Row>
      </div>
    )
  }
}
