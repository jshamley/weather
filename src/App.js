import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Validation from 'react-validation';
import validator from 'validator';
import logo from './logo.svg';
import './App.css';

let $ = require('jquery');

Object.assign(Validation.rules, {
  required: {
    rule: value => {
      return value && value.toString().trim();
    },
    hint: value => {
      return <span className='form-error text-danger is-visible'>Required</span>
    }
  },
  search: {
    rule: value => {
      return value && validator.isNumeric(value) && validator.isLength(value, {min:5, max:5});
    },
    hint: value => {
      return <span className='form-error text-danger is-visible'>{value} isnt a Zipcode.</span>
    }
  },
  api: {
    hint: value => (
      <button className="form-error text-danger is-visible">API Error on "{value}" value. Focus to hide.</button>
    )
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchValue: '',
      showResults: false,
      showError: false
    }

    this.searchWeather = this.searchWeather.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }

  searchWeather(e) {
    e.preventDefault();
    let self = this;

    // search wunderground for current weather
    $.ajax({
      url: 'https://api.wunderground.com/api/' + process.env.REACT_APP_WUNDERGROUND_API_KEY + '/conditions/q/' + this.state.searchValue + '.json',
      dataType: 'jsonp',
      success: function(data) {
        if (data.response.error) {
          console.error(data.response.error);
          self.setState({
            showError: true,
            showResults: false,
            results: undefined,
            error: data.response.error.description
          });
        } else {
          self.setState({
            showResults: true,
            showError: false,
            error: undefined,
            results: data.current_observation
          });
        }
      }
    });

    // search wunderground for 10 day forecast
  }

  searchChange(e) {
    this.setState({searchValue: e.target.value});
  }

  render() {
    let city, image, temp, conditions, error, satellite;
    const apiKey = process.env.REACT_APP_WUNDERGROUND_API_KEY;

    if (this.state.showResults) {
      city = `${this.state.results.display_location.city} ${this.state.results.display_location.state}`;
      image = `<img src="${this.state.results.icon_url}" alt="current conditions icon" />`;
      temp = `${this.state.results.temp_f}`;
      conditions = `${this.state.results.weather}`;
      satellite = `<img src="http://api.wunderground.com/api/${apiKey}/animatedradar/q/${this.state.searchValue}.gif?width=750&height=375&newmaps=1&num=5&delay=50" alt="current conditions icon" />`;
    } else if (this.state.showError) {
      error = `${this.state.error}`;
    }

    return (
      <div className="App">
        <div className="App-header">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-lg-offset-2">
                <img src={logo} className="App-logo pull-left" alt="logo" />
                <h2 className="pull-left">Shamley Weather</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="App-body container">
          <div className="row">
            <div className="col-lg-8 col-lg-offset-2">
              <p className="App-intro">
                Enter your zipcode to search for the weather in your area.
              </p>
              <Validation.components.Form onSubmit={this.searchWeather}>
                <div className="input-group">
                  <Validation.components.Input name="search" containerClassName="form-input-wrapper" errorClassName="input-error" placeholder="80537" className="form-control" value={this.state.search} onChange={this.searchChange} validations={['required', 'search']} />
                  <span className="input-group-btn">
                    <Validation.components.Button className="btn btn-success" type="submit">Search!</Validation.components.Button>
                  </span>
                </div>
              </Validation.components.Form>
            </div>
          </div>
          <div className={this.state.showResults ? 'row search-results' : 'hidden'}>
            <div className="col-lg-8 col-lg-offset-2 text-center">
              <h3>Current Weather for {city}</h3>
              <h5>{temp}&deg; and {conditions}</h5>
              <p dangerouslySetInnerHTML={{__html: image}}></p>
              <p dangerouslySetInnerHTML={{__html: satellite}}></p>
            </div>
          </div>
          <div className={this.state.showError ? 'row search-results' : 'hidden'}>
            <div className="col-lg-8 col-lg-offset-2 text-center">
              <h3 className="text-danger">{error}</h3>
            </div>
          </div>
          <div className="footer">
            <div className="row">
              <div className="col-lg-8 col-lg-offset-2 text-center">
                <h6>
                  <a href="https://www.wunderground.com/" target="_blank">
                    Weather data provided by<br /><img src="http://icons.wxug.com/graphics/wu2/logo_130x80.png" alt="wunderground logo" />
                  </a>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
