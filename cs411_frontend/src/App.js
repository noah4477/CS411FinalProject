import React  from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LandingPage from './Resources/LandingPage';
import Login from './Resources/Login';
import Signup from './Resources/Signup';
import SearchPage from './Resources/Search';
import MyMovies from './Resources/MyMovies';
import MovieDetailView from './Resources/MovieDetailView';
import CrewDetailView from './Resources/CrewDetailView';
import RouterGaurd from './Resources/RouterGaurd';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { movies: [] };
  }
  render () {
  
    return (
      <div>
        <Router>
        <RouterGaurd />
          <Switch>
           
            <Route exact path="/" >
              <LandingPage />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path='/signup'>
              <Signup />
            </Route>
            <Route path="/search">
              <SearchPage />
            </Route>
            <Route path ="/mymovies">
                <MyMovies />
            </Route>
            <Route path ="/movieDetailView">
              <MovieDetailView />
            </Route>
            <Route path ="/crewDetailView">
                <CrewDetailView />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
export default App;
