import React from 'react';
import Header from './Header';
import Carousel from './Helper/Carousel.js'
import { postRequest } from './Request';

import Axios from 'axios'
import AltImg from './Helper/Movie_Not_Found.png'

class LandingPage extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      rByActors : [],
      rByActorPosters : [],
      rByMovies : [],
      rByMoviesPosters : [],
    }
    this.getInfo = this.getInfo.bind(this)
  }
  
  async componentWillMount(){
  
    await postRequest('http://localhost:8000/api/getRecsByActor' )
    .then((data) => data.json())
    .then((data) => {
        if(data.error)
        {console.log("Error in Crew Info");}
        else 
        { 
          let movies = (data.topMovies[0])
          movies = movies.map( m => m.tconst )
          this.getInfo(movies, 'actor')
          this.setState({rByActors : movies})  
        }
    });
      
    await postRequest('http://localhost:8000/api/getRecsByMovie' )
    .then((data) => data.json())
    .then((data) => {
        if(data.error)
        {console.log("Error in Crew Info");}
        else 
        { 
          let movies = (data.topMovies[0])
          movies = movies.map( m => m.tconst )
          this.getInfo(movies, 'movie')
          this.setState({rByMovies : movies})  
        }
    });
  }
  
  getInfo (list , type){
    

    let stateVar = (type === 'movie') ? 'rByMoviesPosters' : 'rByActorPosters' 
    
    let  promises =[]
  
    for (let i = 0; i< list.length ; i ++){
        const promise =  Axios.get(`https://api.themoviedb.org/3/find/${list[i]}?api_key=0bd4af129149c95eb2534f872838d4a9&language=en-US&external_source=imdb_id`)
        promises.push(promise)
    }
    
    let  moviePosterList = []
    Axios.all(promises)
      .then((response) =>{
        
        for (let i=0; i < list.length ; i++){
              let movieInfo = response[i].data;
              let details = movieInfo ? (movieInfo.movie_results.length ? movieInfo.movie_results : (movieInfo.tv_results.length ? movieInfo.tv_results : 0 ) ) : 0; 
              let imgURL = (details && details[0].poster_path) ? "https://image.tmdb.org/t/p/w200" + details[0].poster_path  : AltImg
              moviePosterList.push(imgURL)
          }
          this.setState({[stateVar] : moviePosterList})   
    })
  
  }
  
  render(){
    let mCarousel = ( this.state.rByMoviesPosters.length ) ? <Carousel 
    Ids = {this.state.rByMovies} posters = {this.state.rByMoviesPosters} speed = {5} /> : ''
    // 
    let aCarousel = ( this.state.rByActorPosters.length ) ? <Carousel 
    Ids = {this.state.rByActors} posters = {this.state.rByActorPosters} speed = {5} /> : ''
    
  
    return (
      <div>
        <Header />
        <div style ={{padding : "70px 0px 0px 0px"}}>
        {"Recommendations By Actors"}<br/>
          {aCarousel}
        {"Recommendations By Movies"}<br/>
            {mCarousel}
        
        </div>
      </div>
    );
  
}}

export default LandingPage;


