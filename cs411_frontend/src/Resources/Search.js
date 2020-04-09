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

    componentWillMount() {
        postRequest('http://localhost:8000/search', this.getParam())
        .then((data) => data.json())
        .then((data) => {
            if(data.error)
            {
                console.log("Error in getting search data");
            }
            else 
            {
                this.setState({ searchData: data.results });
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
            <List className={classes.root} subheader={<li />}>
            {[0, 1, 2, 3, 4].map((movie_name) => (
                <li key={`section-${movie_name}`} className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListItem key={`Movie-${movie_name}` }>
                        <ListItemText primary={`Movie ${movie_name} ` + this.getParam().term} />
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
            {this.getMovies()}
            </div>
        );
    }
}

export default withStyles(style)(withRouter(SearchPage));
