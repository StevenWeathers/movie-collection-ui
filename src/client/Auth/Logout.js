import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Redirect
} from 'react-router-dom'

export default class Logout extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
  }

  componentWillMount = () => {
    this.props.onLogout()
  }
  
  render () {    
    return (
      <Redirect push to="/" />
    )
  }
}
