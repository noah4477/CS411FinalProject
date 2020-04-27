import React from 'react'
import Header from './Header';
import { withRouter } from 'react-router-dom';
import QueryString from 'query-string'

import { getRequest } from './Request';

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


class DetailView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      movieInfo : undefined,
      title : QueryString.parse(this.props.location.search)['title']
    }
    this.exit = this.exit.bind(this)
  }

  exit(data){
    this.props.history.push('/')
    
  }

  
    async componentWillMount() {
    const movie = QueryString.parse(this.props.location.search)
    console.log({...this.props.location})
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
  }
  
// goback  


  render(){ 
      let movieInfo = this.state.movieInfo;
      let details = movieInfo ? (movieInfo.movie_results.length ? movieInfo.movie_results : (movieInfo.tv_results.length ? movieInfo.tv_results : 0 ) ) : 0; 
      let imgURL = (details) ? "https://image.tmdb.org/t/p/w200/" + details[0].poster_path  :''
      let title =   this.state.title// (details.length) ? details[0].title : "Not Available"
      let overview =   (details.length) ? details[0].overview : "-"
      let release_date =   (details.length) ? details[0].release_date : "-"
      let voteAvg =   (details.length) ? details[0].vote_average : "-"
      
      return (
              <>
                <Header />
              <div style = {style1}>
                <p onClick = {this.exit }>X </p>
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
                         Release Data : {release_date}
                      </div>
                      <div><br/>
                        Vote Avg :  {voteAvg}
                      </div>
                    </div>
                  </div>
                </div>
                </>
    )
  }
  
  
}


export default (withRouter(DetailView));