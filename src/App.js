import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './logo.svg';
import './App.css';

let $ = require('jquery');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      showResults: false
    }

    this.searchWeather = this.searchWeather.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }

  searchWeather(e) {
    e.preventDefault();

    // search wunderground for weather
    $.getJSON('http://api.wunderground.com/api/b6582f1b71cd734c/conditions/q/CA/San_Francisco.json')
      .then(data => {
        console.log(data, this.state);
        this.setState({
          showResults: true,
          results: data.current_observation
        });
      });
  }

  searchChange(e) {
    this.setState({searchValue: e.target.value});
  }

  render() {
    let city, image, temp, conditions;

    if (this.state.showResults) {
      city = `${this.state.results.display_location.city} ${this.state.results.display_location.state}`;
      image = `<img src="${this.state.results.icon_url}" alt="current conditions icon" />`;
      temp = `${this.state.results.temp_f}`;
      conditions = `${this.state.results.weather}`;
    }

    console.log(this.state);

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Shamley Weather</h2>
        </div>
        <div className="App-body container">
          <div className="row">
            <div className="col-lg-8 col-lg-offset-2">
              <p className="App-intro">
                Enter your zipcode to search for the weather in your area.
              </p>
              <div className="input-group">
                <input type="text" name="search" placeholder="search by zipcode" className="form-control" onChange={this.searchChange} />
                <span className="input-group-btn">
                  <button onClick={this.searchWeather} className="btn btn-success" type="button">Search!</button>
                </span>
              </div>
            </div>
          </div>
          <div className={this.state.showResults ? 'row search-results' : 'hidden'}>
            <div className="col-lg-8 col-lg-offset-2 text-center">
              <h3>Current Weather for {city}</h3>
              <h5>{temp}&deg; and {conditions}</h5>
              <p dangerouslySetInnerHTML={{__html: image}}></p>
            </div>
          </div>
          <div className="row footer">
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
    );
  }
}

export default App;
