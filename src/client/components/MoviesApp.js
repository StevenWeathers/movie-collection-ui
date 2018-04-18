import React, { Component } from 'react'
import {
  Card,
  Row,
  Col,
  Layout,
  Menu
} from 'antd'

const {
  Header,
  Content
} = Layout

const tmdbHost = 'http://image.tmdb.org/t/p/w154'

export default class MoviesApp extends Component {
  state = {
    movies: [],
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
      })
    } catch (e) {
      console.log('error >>> ', e);
    }
  }

  render () {
    const {
      movies
    } = this.state

    return (
      <Layout className='layout'>
        <Header>
          <Menu
            theme='dark'
            mode='horizontal'
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key='1'>MyMovies</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24 }}>
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

                      title={title} extra={<a href={slug}>View</a>}>
                      <img src={`${tmdbHost}${tmdb_image_url}`} />
                    </Card>
                  </Col>
                ))
              }
            </Row>
          </div>
        </Content>
      </Layout>
    )
  }
}
