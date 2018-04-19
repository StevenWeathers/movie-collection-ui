import React, { Component } from 'react'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'

import Login from './Auth/index'
import Logout from './Auth/Logout'
import Movies from './Movies/index'
import Movie from './Movies/Movie'
import Admin from './Admin/index'

import {
    Layout,
    Menu
} from 'antd'
import './styles.css'
  
const {
  Header,
  Content
} = Layout

class MoviesApp extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  }

  componentWillMount() {
    const { cookies } = this.props;
 
    this.state = {
      movies: [],
      session: cookies.get('mcsession', {
        doNotParse: true
      }) || null
    }
  }

  handleLogin = (token) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    this.props.cookies.set('mcsession', token, {
      path: '/',
      expires: tomorrow
    })

    this.setState({
      session: token
    })
  }

  handleLogout = () => {
    this.props.cookies.remove('mcsession')

    this.setState({
      session: null
    })
  }

  render () {
    const {
      session
    } = this.state

    return (
      <Router>
        <Layout className='layout'>
          <Header>
            <Menu
              theme='dark'
              mode='horizontal'
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key='home'><Link to='/'>MyMovies</Link></Menu.Item>
              <Menu.Item key='admin'><Link to='/admin'>Admin</Link></Menu.Item>
              {
                session &&
                <Menu.Item key='users'>
                  <Link to='/logout'>Logout</Link>
                </Menu.Item>
              }
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <div style={{ background: '#fff', padding: 24 }}>
              <Route exact path='/' component={Movies} />
              <Route exact path='/movies/:movieId' render={({ match }) => (
                <Movie
                  movieId={match.params.movieId}
                />
              )} />
              <Route exact path='/login' render={() => (
                <Login
                  onLogin={this.handleLogin}
                />
              )} />
              <Route exact path='/logout' render={() => (
                <Logout
                  onLogout={this.handleLogout}
                />
              )} />
              <Route path='/admin' render={() => (
                session ? (
                  <Admin session={session} />
                ) : (
                  <Redirect push to='/login' />
                )
              )} />
            </div>
          </Content>
        </Layout>
      </Router>
    )
  }
}

export default withCookies(MoviesApp);