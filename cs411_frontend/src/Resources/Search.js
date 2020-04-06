import React from 'react';
import Header from './Header';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { fade, withStyles,createMuiTheme  } from '@material-ui/core/styles';

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
        this.getParam = this.getParam.bind(this);
        this.getMovies = this.getMovies.bind(this);
    }
    getParam()
    {
        const values = queryString.parse(this.props.location.search)
        return values.term;
    }
    getMovies() {
        const { classes } = this.props;
    return (
        <List className={classes.root} subheader={<li />}>
        {[0, 1, 2, 3, 4].map((movie_name) => (
            <li key={`section-${movie_name}`} className={classes.listSection}>
            <ul className={classes.ul}>
                <ListItem key={`Movie-${movie_name}` }>
                    <ListItemText primary={`Movie ${movie_name} ` + this.getParam()} />
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
            Search Page
            {this.getMovies()}
           
            </div>
        );
    }
}

export default withStyles(style)(withRouter(SearchPage));
