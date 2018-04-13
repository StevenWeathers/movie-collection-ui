import _ from 'lodash';
import React, { Component } from 'react'
import {
  Intent,
  Alignment,
  Spinner,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Button,
  Card,
  Elevation
} from '@blueprintjs/core'

const tmdb_host = 'http://image.tmdb.org/t/p/w154'

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
      <div>
        <Navbar className='pt-dark pt-fixed-top'>
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>MyMovies</NavbarHeading>
            <NavbarDivider />
            <Button className='pt-minimal' text='Home' />
          </NavbarGroup>
        </Navbar>
        <div class='row'>
          <div class='col-xs-12 col-md-12 col-lg-12'>
            {/* <Spinner intent={Intent.PRIMARY} /> */}
            <div class="row">
              {
                movies.length > 0 &&
                _.map(movies, ({
                  title,
                  tmdb_image_url,
                  slug,
                }, index) => (
                  <div class='col-xs-3 col-md-3 col-lg-3'>
                    <Card interactive elevation={Elevation.TWO}>
                      <p><img src={`${tmdb_host}${tmdb_image_url}`} /></p>
                      <h5>
                        {title}
                      </h5>
                      <Button>View</Button>
                    </Card>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
