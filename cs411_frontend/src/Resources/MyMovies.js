import React from 'react';
import Header from './Header';
import { withRouter } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { fade, withStyles,createMuiTheme  } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

import { postRequest } from './Request';

import Axios from 'axios'
import AltImg from './Helper/Movie_Not_Found.png'
import {Star_Rating} from './Helper/Star_Rating.js'


const theme = createMuiTheme({
    palette: {
    },
  });

const style = {
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
      maxHeight: 300,
    },
    listSection: {
      backgroundColor: 'inherit',
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
  };


class MyMovies extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
           movies: [],
           moviesInfoObj : [],
           actors: [],
           actorsInfoObj : []
         };
         this.getMovies = this.getMovies.bind(this)
         this.getCrew = this.getCrew.bind(this)
    }

    async componentWillMount() {
      
        await postRequest("http://localhost:8000/api/getFavoriteMovies")
        .then(data => data.json())
        .then((data) => {
            if(data.error)
            {
                console.log("Error in getting search data");
            }
            else 
            { 
               this.setState({movies : data.favoriteMovies});
              
            }
        })
        
        let movieInfo = [] , promises =[], movies = this.state.movies;
        
        for (let i = 0; i< this.state.movies.length ; i ++){
            const promise =  Axios.get(`https://api.themoviedb.org/3/find/${this.state.movies[i].tconst}?api_key=0bd4af129149c95eb2534f872838d4a9&language=en-US&external_source=imdb_id`)
            promises.push(promise)
        }
        
        Axios.all(promises)
          .then((response) =>{
            for (let i=0; i < this.state.movies.length ; i++){
                  let info = response[i].data;
                  info = info.movie_results[0] || info.tv_results[0];
                  if (info){
                    info.id = this.state.movies[i].tconst
                    info.rating = this.state.movies[i].stars
                    movieInfo.push(info);
                }
              }
              this.setState({moviesInfoObj : movieInfo})
        })
        
        await postRequest("http://localhost:8000/api/getFavoriteActors")
        .then(data => data.json())
        .then((data) => {
            if(data.error)
            {
                console.log("Error in getting search data");
            }
            else 
            { 
               this.setState({actors : data.favoriteActors});  
            }
        })
        
        let actorInfo = [] , vromises =[], actors = this.state.actors;
        
        for (let i = 0; i< actors.length ; i ++){
            const promise =  Axios.get(`https://api.themoviedb.org/3/find/${actors[i].nconst}?api_key=0bd4af129149c95eb2534f872838d4a9&language=en-US&external_source=imdb_id`)
            vromises.push(promise)
        }
        
        Axios.all(vromises)
          .then((response) =>{
            for (let i=0; i < actors.length ; i++){
                  let info = response[i].data;
                  info = info.person_results[0] ;
                  if (info){
                    info.id = actors[i].nconst
                    info.rating = actors[i].stars
                    actorInfo.push(info);
                }
              }
              this.setState({actorsInfoObj : actorInfo})
        })
        
        
        
        
    }
  

    

    getCrew() {
  
      let url = "https://image.tmdb.org/t/p/original";
      
        return (
            <div style = {{width: '80%', margin : 'auto'}}>
            <List  style={{ maxWidth: 'unset', maxHeight: 'calc(100vh - 144px)'}} subheader={<li />}>
             {(!this.state.actorsInfoObj.length) ? <Typography>No Results</Typography> : <></>}
             {(this.state.actorsInfoObj || []).map((movie,i) => (
                 <li key={`section-${movie.id}`} style = {{marginTop : '12px' , backgroundColor : 'grey'}}>
                 <ul style = {{padding : '30px'}} >
                 
                      <div style = {{display : 'flex' , justifyContent : 'space-between' , width : '100%' }}>
                        <div style = {{ maxWidth : '150px', paddingTop :'10px'}} onClick = { () => this.props.history.push("/crewDetailView?name=null"+"&id=" + movie.id  )  }>
                          <img style = {{width:'100%'}} src = {url+movie.profile_path || AltImg} />
                        </div>
                        <div style = {{width : '200px' , verticalAlign: 'middle'}}>
                            <Star_Rating id={movie.id} type = {'actor'}/>
                        </div>
                      </div>
                      
                         <ListItem key={`Movie-${movie.id}`   }> 
                             <ListItemText primary={ `${movie.name}`} />
                         </ListItem>
                 </ul>
                 </li>
             ))}
            </List>
            </div>
        );
    }
    
    getMovies(){
      let url = "https://image.tmdb.org/t/p/original";
      
        return (
            <div style = {{width: '80%', margin : 'auto'}}>
            <List  style={{ maxWidth: 'unset', maxHeight: 'calc(100vh - 144px)'}} subheader={<li />}>
             {(!this.state.moviesInfoObj.length) ? <Typography>No Results</Typography> : <></>}
             {(this.state.moviesInfoObj || []).map((movie,i) => (
                 <li key={`section-${movie.id}`} style = {{marginTop : '12px' , backgroundColor : 'grey'}}>
                 <ul style = {{padding : '30px'}} >
                 
                      <div style = {{display : 'flex' , justifyContent : 'space-between' , width : '100%'}}>
                        <div style = {{ maxWidth : '150px'}} onClick = { () => this.props.history.push("/movieDetailView?title=null"+"&mID=" + movie.id  )  }>
                          <img style = {{width:'100%'}} src = {url+movie.poster_path || AltImg} />
                        </div>
                        <div style = {{width : '200px' , verticalAlign: 'middle'}}>
                            <Star_Rating id={movie.id} type = {'movie'}/>
                        </div>
                      </div>
                      
                         <ListItem key={`Movie-${movie.id}`   }> 
                             <ListItemText primary={ `${movie.title}`} />
                         </ListItem>
                 </ul>
                 </li>
             ))}
            </List>
            </div>
        );
    }
    
    
    render() {
        return (
            <>
                <Header />
                <div style = {{display : 'flex' , width : '70%', margin : 'auto'}} >
                  <div style = {{ width : '50%'}} >
                      {"Liked Movies"}
                      {this.getMovies()}
                  </div>
                  <div style = {{ width : '50%'}}>
                      {"Liked Crew"}
                      {this.getCrew()}
                  </div>
                </div>
            </>
        );
    }
}

export default withStyles(style)(withRouter(MyMovies));

