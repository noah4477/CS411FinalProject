import React from 'react'
import Header from './Header';
import { withRouter } from 'react-router-dom';
import QueryString from 'query-string'

import { getRequest, postRequest } from './Request';
import PersonList from './PersonList.js'

import CloseIcon from '@material-ui/icons/Close';

const style2 = {
  marginTop: '34px',
   width: '100%',
   display:'flex',
   alignItems: 'center',
   justifyContent: 'center',
   flexDirection: 'column'
}

const style3 =  {
  marginTop: '34px',
  width: '100%',
  display:'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
}


const style1 = {
  width: '80%',
  backgroundColor:  '#d0d7d9',
  padding: '15px',
  margin: 'auto',
  marginTop: '3vh'
}


class MovieDetailView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      movieInfo : undefined,
      title : QueryString.parse(this.props.location.search)['title'],
      aList : [],
      dList : [],
      name_Id : [],
      avgRatings : '',
      numVotes : '' 
    }
    this.exit = this.exit.bind(this)
  }

  exit(data){
    this.props.history.push('/')
    
  }

  
    async componentWillMount() {
    const movie = QueryString.parse(this.props.location.search)
    let url = `https://api.themoviedb.org/3/find/${movie.mID}?api_key=0bd4af129149c95eb2534f872838d4a9&language=en-US&external_source=imdb_id`
  
     await getRequest(url)
    .then((data) => data.json())
    .then((data) => {
        if(data.error)
        {
            console.log("Error in getting search data");
        }
        else 
        { 
          this.setState({movieInfo : data})
        }
    });  
    
      postRequest('http://localhost:8000/api/getRatingInfo', {movie: movie.mID} )
      .then((data) => data.json())
      .then((data) => {
          if(data.error)
          {console.log("Error in ratingInfo");}
          else 
          { 
            this.setState({avgRatings : data.averageRating, numVotes : data.numVotes})
          }
      });  
      
      postRequest('http://localhost:8000/api/getPairingInfo', {movie: movie.mID} )
      .then((data) => data.json())
      .then((data) => {
          if(data.error)
          {console.log("Error in pairing Info");}
          else 
          { 
            let actorlist = [], dirlist = [], info_ID = {}
            data.forEach((item) => {
              if (item.category === 'actor')
                actorlist.push(item.primaryName)
              else if (item.category === 'director')
                dirlist.push(item.primaryName)
              
              let name = item.primaryName
              let id = item.nconst
              info_ID = {...info_ID , ...{[name] : id}};
              
            });
            this.setState({ aList : actorlist, dList : dirlist , name_Id : info_ID})
          }
      }); 
  }
  



  render(){ 
      let movieInfo = this.state.movieInfo;
      let details = movieInfo ? (movieInfo.movie_results.length ? movieInfo.movie_results : (movieInfo.tv_results.length ? movieInfo.tv_results : 0 ) ) : 0; 
      let imgURL = (details) ? "https://image.tmdb.org/t/p/w200/" + details[0].poster_path  :''
      let title =   this.state.title// (details.length) ? details[0].title : "Not Available"
      let overview =   (details.length) ? details[0].overview : "-"
      let release_date =   (details.length) ? details[0].release_date : "-"
      
      
      return (
              
              <>
                <Header />
              <div style = {style1}>
                <CloseIcon onClick = {this.exit }/>
                <h2 style = {{textAlign : 'center'}}> <u>  {title} </u></h2>
                  <div style = {style2}  >
                    <div>
                      <img src = {imgURL}  alt ='Bag'/>
                    </div>
                    <div style = {style3}>
                      <div>
                        {overview}
                      </div>
                      <div><br/>
                         Release Date : {release_date}
                      </div>
                      <div><br/>
                        Avg Ratings :  {this.state.avgRatings} / 10
                        <br/>
                        Num Votes : {this.state.numVotes}
                      </div><br/>
                      
                      Actors :  <PersonList list = {this.state.aList} crewId = {this.state.name_Id}/>
                      <br/>
                      Directors :  <PersonList list = {this.state.dList} crewId = {this.state.name_Id}/>
                      
                    </div>
                  </div>
                </div>
                </>
    )
  }
  
  
}


export default (withRouter(MovieDetailView));