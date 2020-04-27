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
        this.state = { searchData: { crew: [], titles: [] } };
        this.getParam = this.getParam.bind(this);
        this.getMovies = this.getMovies.bind(this);
        this.likeMovie = this.likeMovie.bind(this);
        this.unlikeMovie = this.unlikeMovie.bind(this);
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
                  this.setState({ searchData: data });
              }
          });
    }
    componentWillUnmount() {
        this.unlisten();
    }

    unlikeMovie(tconst)
    {
        postRequest('http://localhost:8000/api/movieUnlike', {movie: tconst} )
        .then((data) => data.json())
        .then((data) => {
            if(data.error)
            {
                console.log("Error in getting search data");
            }
            else 
            {
                this.setState({searchData: { crew: this.state.searchData.crew, titles: this.state.searchData.titles.map((elem) => 
                { 
                    if(elem.tconst === tconst)
                    {
                        elem.uid = null;
                    } 
                    return elem;
                })}});
            }
        });
    }

    likeMovie(tconst, uid)
    {
        postRequest('http://localhost:8000/api/movieLike', { movie: tconst })
        .then((data) => data.json())
        .then((data) => {
            if(data.error)
            {
                console.log("Error in getting search data");
            }
            else 
            {
               this.setState({searchData: { crew: this.state.searchData.crew, titles: this.state.searchData.titles.map((elem) => 
                { 
                    if(elem.tconst == tconst)
                    {
                        return {...elem, uid: uid};
                    } 
                    return elem;
                })}});
            }
        });
    }



    getParam()
    {
        const values = queryString.parse(this.props.location.search)
        return {term: values.term, type: values.type };
    }
    getMovies() {
        const { classes } = this.props;
        return (
            <List className={classes.root} style={{ maxWidth: 'unset', maxHeight: 'calc(100vh - 144px)'}} subheader={<li />} >
            {(this.state.searchData == undefined || (this.state.searchData.titles == [] && this.state.searchData.crew == [])) && (<Typography>No Results</Typography>)}
            {(this.state.searchData && this.state.searchData.titles || []).map((movie) => (
                <li key={`section-${movie.tconst}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`Movie-${movie.tconst}`} onClick= {() => this.props.history.push("/DetailView?mID=" + movie.tconst)} >
                        <ListItemText primary={`Movie: ${movie.primarytitle}`} />
                        <Button onClick={() => {  movie.uid ? this.unlikeMovie(movie.tconst) : this.likeMovie(movie.tconst, 'u000001') }} > { movie.uid ? "Unlike" : "Like" } </Button>
                    </ListItem>
                </ul>
                </li>
            ))}
            {(this.state.searchData && this.state.searchData.crew || []).map((crew) => (
                <li key={`section-${crew.nconst}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`Crew-${crew.primaryName}` }>
                        <ListItemText primary={`Crew: ${crew.primaryName}`} />
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
