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


class MyMovies extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { movies: [] };
        this.getMovies = this.getMovies.bind(this);
    }

    componentWillMount() {
        postRequest("http://localhost:8000/api/getMyFavorites", { uid: 'u000001' })
        .then(data => data.json())
        .then((data) => {
            if(data.error)
            {
                console.log("Error in getting search data");
            }
            else 
            {
               this.setState({movies: data.result});
            }
        });
    }
    componentWillUnmount() {
  
    }

  
    getMovies() {
        const { classes } = this.props;
        return (
            <List className={classes.root} style={{ maxWidth: 'unset', maxHeight: 'calc(100vh - 144px)'}} subheader={<li />}>
            {((this.state.movies === undefined || this.state.movies === [])) && (<Typography>No Results</Typography>)}
            {(this.state.movies || []).map(movie => (
                <li key={`section-${movie.tconst}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`Movie-${movie.tconst}` }>
                        <ListItemText primary={`Movie: ${movie.primaryTitle}`} />
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
