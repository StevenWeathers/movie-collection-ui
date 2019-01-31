import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Redirect
} from 'react-router-dom'

import {
    Layout,
    Menu,
    Form,
    Icon,
    Input
} from 'antd'

const Search = Input.Search;

class SearchForm extends Component {
  static propTypes = {
    redirectTo: PropTypes.string
  }

  static defaultProps = {
    redirectTo: 'search'
  }

  state = {
    searchQuery: ''
  }

  handleSearch = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err && values.search !== undefined) {
        this.setState({
          searchQuery: values.search
        })
      }
    });
  }

  render() {
    const { searchQuery } = this.state
    const { form, redirectTo } = this.props
    const { getFieldDecorator } = form

    return (
      <Form layout="inline" onSubmit={this.handleSearch} style={{ marginBottom: 20 }}>
        {getFieldDecorator('search')(
          <Search
            size="large"
            enterButton
            placeholder="Search Movies"
          />
        )}
        {
          searchQuery !== '' &&
          <Redirect push to={`/${redirectTo}/${searchQuery}`} />
        }
      </Form>
    );
  }
}

export default Form.create()(SearchForm)