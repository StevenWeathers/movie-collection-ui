import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {
  Layout,
  Menu
} from 'antd'
import './styles.css'

import MoviesApp from './components/MoviesApp'
import AdminDashboard from './components/Admin/Dashboard'

const {
  Header,
  Content
} = Layout

ReactDOM.render(
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
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24 }}>
          <Route exact path='/' component={MoviesApp} />
          <Route path='/admin' component={AdminDashboard} />
        </div>
      </Content>
    </Layout>
  </Router>,
  document.getElementById('moviesApp')
)
