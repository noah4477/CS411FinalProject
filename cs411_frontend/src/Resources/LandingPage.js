import React from 'react';
import Header from './Header';
import Carousel from './Helper/Carousel.js'
import { postRequest } from './Request';


class LandingPage extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      rByActors : [],
      rByMovies : ['tt0078346','tt1434447','tt2377938','tt0059800','tt1280558','tt1408101','tt0120382','tt0338013','tt0057076','tt0311429']
    }
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
          this.setState({ rByActors : movies})
          // console.log(this.state.rByActors)
        }
    });
  
  
  
  
  
  }
  
  render(){
    
    return (
      <div>
        <Header />
        <div style ={{padding : "70px 0px 0px 0px"}}>
          <Carousel Ids = {this.state.rByMovies} speed = {5} />
          <Carousel Ids = {this.state.rByMovies} speed = {5} />
        </div>
      </div>
    );
  
}}

export default LandingPage;


