import React from 'react'
import ReactDOM from 'react-dom'
import { CookiesProvider } from 'react-cookie'
import MoviesApp from './app'

ReactDOM.render(
  <CookiesProvider>
    <MoviesApp />
  </CookiesProvider>
  ,
  document.getElementById('moviesApp')
)
