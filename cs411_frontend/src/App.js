import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LandingPage from './Resources/LandingPage';
import Login from './Resources/Login';
import SearchPage from './Resources/Search';
import MyMovies from './Resources/MyMovies';
import MovieDetailView from './Resources/MovieDetailView';
import CrewDetailView from './Resources/CrewDetailView';
import './App.css';


function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" >
            <LandingPage />
          </Route>
          <Route path="/login">
            <Login />
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

export default App;
