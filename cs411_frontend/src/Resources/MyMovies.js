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
import { postRequest } from './Request';
import Axios from 'axios'

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
           moviesInfoObj : []
         };
         this.getMovies = this.getMovies.bind(this)
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
    }
  

    

    getMovies() {
        return (
            <List  style={{ maxWidth: 'unset', maxHeight: 'calc(100vh - 144px)'}} subheader={<li />}>
             {(!this.state.moviesInfoObj.length) ? <Typography>No Results</Typography> : <></>}
             {(this.state.moviesInfoObj || []).map((movie,) => (
                 <li key={`section-${movie.id}`} >
                 <ul >
                     <ListItem key={`Movie-${movie.id}` }>
                         <ListItemText primary={`Movie: ${movie.title}`} />
                     </ListItem>
                 </ul>
                 </li>
             ))}
            </List>
        );
    }
    
    render() {
        return (
            <div>
                <Header />
                <div>
                    {this.getMovies()}
                </div>
            </div>
        );
    }
}

export default withStyles(style)(withRouter(MyMovies));

