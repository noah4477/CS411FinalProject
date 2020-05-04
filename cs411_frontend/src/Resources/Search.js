import React from 'react';
import Header from './Header';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { fade, withStyles,createMuiTheme  } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { postRequest } from './Request';
import Button from '@material-ui/core/Button';
import {Star_Rating} from './Helper/Star_Rating.js'
import Axios from 'axios'

import AltImg from './Helper/Movie_Not_Found.png'


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


class SearchPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { searchData: { crew: [], titles: [] },
        moviesInfoObj : [],
        crewInfoObj : []
       };
        this.getParam = this.getParam.bind(this);
        this.getMovies = this.getMovies.bind(this);
        
        this.refineMoviesData = this.refineMoviesData.bind(this);
        this.refineCrewData = this.refineCrewData.bind(this);
    }

    componentWillMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            if(location.pathname === '/search')
            {
                const values = queryString.parse(location.search);
                postRequest('http://localhost:8000/api/search', {term: values.term, type: values.type })
                .then((data) => data.json())
                .then((data) => {
                    if(data.error)
                    {
                        console.log("Error in getting search data");
                    }
                    else 
                    {     
                        this.setState({ searchData: data });
                    }
                });
            }
          });
          postRequest('http://localhost:8000/api/search', this.getParam())
          .then((data) => data.json())
          .then((data) => {
              if(data.error)
              {
                  console.log("Error in getting search data");
              }
              else 
              {   
                if (data.titles) this.refineMoviesData(data.titles)
                if (data.crew) this.refineCrewData(data.crew)
                  this.setState({ searchData: data });
              }
          });
          
    }
    componentWillUnmount() {
        this.unlisten();
    }
    
    refineMoviesData(info){
      let movieInfo = [] , promises =[];
      
      for (let i = 0; i< info.length ; i ++){
          const promise =  Axios.get(`https://api.themoviedb.org/3/find/${info[i].tconst}?api_key=0bd4af129149c95eb2534f872838d4a9&language=en-US&external_source=imdb_id`)
          promises.push(promise)
      }
      Axios.all(promises)
        .then((response) =>{
          for (let i=0; i < info.length ; i++){
                let result = response[i].data;
                result = result.movie_results[0] || result.tv_results[0];
                if (result){
                  result.tconst = info[i].tconst
                  movieInfo.push(result);
              }
            }
            this.setState({moviesInfoObj : movieInfo.slice(0,15)})
            // console.log("Movie Results are : \n " , movieInfo)
      })
    }
    
    refineCrewData(info){
      let crewInfo = [] , promises =[];
      for (let i = 0; i< info.length ; i ++){
          const promise =  Axios.get(`https://api.themoviedb.org/3/find/${info[i].nconst}?api_key=0bd4af129149c95eb2534f872838d4a9&language=en-US&external_source=imdb_id`)
          promises.push(promise)
      }
      Axios.all(promises)
        .then((response) =>{
          for (let i=0; i < info.length ; i++){
                let result = response[i].data;
                result = result.person_results[0]
                if (result){
                  result.nconst = info[i].nconst
                  crewInfo.push(result);
              }
            }
            this.setState({crewInfoObj : crewInfo.slice(0,15)})
            // console.log("Crew Results are : \n " , crewInfo)
      })
      
    }



    getParam()
    {
        const values = queryString.parse(this.props.location.search)
        return {term: values.term, type: values.type };
    }
    getMovies() {
        let url = "https://image.tmdb.org/t/p/original";
        const { classes } = this.props;
        console.log(this.state.crewInfoObj)
        return (
            <List className={classes.root} style={{ maxWidth: 'unset', maxHeight: 'calc(100vh - 144px)'}} subheader={<li />} >
            {(this.state.moviesInfoObj == undefined || (this.state.moviesInfoObj == [] && this.state.crewInfoObj == [])) && (<Typography>No Results</Typography>)}
            {'MOVIES'}
            {(this.state.moviesInfoObj && this.state.moviesInfoObj || []).map((movie) => (
                <li key={`section-${movie.tconst}`} className={classes.listSection} style = {{marginTop : '12px' , backgroundColor : 'grey'}}>
                <ul className={classes.ul}>
                  <div style = {{display : 'flex' , justifyContent : 'space-between' , width : '100%'}}>
                    <div style = {{ maxWidth : '150px'}} onClick = { () => this.props.history.push("/movieDetailView?title=null"+"&mID=" + movie.tconst  )  }>
                      <img style = {{width:'100%'}} src = {(movie.poster_path) ? url+movie.poster_path : AltImg} />
                    </div>
                    
                    <div style = {{width : '200px' , verticalAlign: 'middle'}}>
                      <Star_Rating id={movie.tconst} type = {'movie'}/>
                    </div>
                  </div>
                  
                    <ListItem key={`Movie-${movie.tconst}`}  >
                        <ListItemText primary={` ${movie.title}`} />
                    </ListItem>
                </ul>
                </li>
            ))}<br/>
            
            {'CREW'}
            {(this.state.crewInfoObj && this.state.crewInfoObj || []).map((crew) => (
                <li key={`section-${crew.nconst}`} className={classes.listSection} style = {{marginTop : '12px' , backgroundColor : 'grey'}}>
                <ul className={classes.ul}>
                <div style = {{display : 'flex' , justifyContent : 'space-between' , width : '100%'}}>
                  <div style = {{ maxWidth : '150px'}} onClick={() => {this.props.history.push('/crewDetailView?id=' +crew.nconst + "&name=" + crew.name) }}>
                    <img style = {{width:'100%'}} src = {(crew.profile_path) ?url+crew.profile_path : AltImg} />
                  </div>
                
                  <div style = {{width : '200px' , verticalAlign: 'middle'}}>
                    <Star_Rating id={crew.nconst} type = {'actor'}/>
                  </div>
                  </div>
                
                    <ListItem key={`Crew-${crew.name}` }>
                        <ListItemText primary={`${crew.name}`}  />
                    </ListItem>
                    
                </ul>
                </li>
            ))}
            </List>
        );
    }
    
    render() {
      
       // console.log("Movies : \n" , this.state.moviesInfoObj)
       // console.log("Actors : \n" , this.state.crewInfoObj)
        return (
        <div>
            <Header />
            <Typography variant="h6" style={{padding: 16}}> Results for term: "<i>{this.getParam().term}</i>"</Typography>
            <Divider />
            <div>
                {this.getMovies()}
            </div>
            </div>
        );
    }
}

export default withStyles(style)(withRouter(SearchPage));
