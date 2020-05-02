import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade, withStyles,createMuiTheme  } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import lightBlue from '@material-ui/core/colors/lightBlue';
import grey from '@material-ui/core/colors/grey';
import { withRouter } from 'react-router-dom';
import SearchMenu from './SearchMenu';
import Grid from "@material-ui/core/Grid";
import StarsIcon from '@material-ui/icons/Stars';
const Cookies = require('js-cookie');

const theme = createMuiTheme({
    palette: {
      primary: grey,
      secondary: lightBlue,
    },
  });

const style = {
    settings: {
        position: 'absolute',
        right: '0px'
    },
    SettingsIcon: {
        color: 'white'
    },
    search: {
        color: 'white',
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '50vw',
        },
      },
      searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '100%',
        },
      },
    };


class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchTerm: ""};
        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(event) {
        event.preventDefault();
        this.props.history.push("/search?term=" +this.state.searchTerm+"&type="+this.refs.searchmenuref.getType());
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Toolbar style={{backgroundColor: 'grey'}}>
                      <Button onClick={() => { this.props.history.push("/"); }} style={{left: -16, paddingLeft: 0, width: 240}}>
                        <Typography style={{color: 'white', width: 200}} variant="h6" noWrap>
                            IMDB Visualizer
                        </Typography>
                      </Button>
                     
                    <Grid container  >
                    <Grid item xs={6} sm={2} style={{maxWidth: 120}}>
                    <SearchMenu ref={"searchmenuref"} />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      
                        <div className={classes.search}>
                           
                            <form onSubmit= {this.submitForm}>
                            <div className={classes.searchIcon}>
                            <SearchIcon />
                            </div>
                            <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(event) => { this.setState({ searchTerm: event.target.value }); }}
                            value = {this.state.searchTerm}
                            fullWidth 
                            />
                            </form>
                    </div>
                    </Grid>
                    </Grid>
                    <div className={classes.settings} style={{right: 64}}>
                      <Button onClick = {() => { this.props.history.push("/mymovies"); }}>
                        <StarsIcon className={classes.SettingsIcon}></StarsIcon>
                      </Button>
                      </div>
                    <div className={classes.settings}>
                        <Button onClick = { () =>  {Cookies.remove('jwt'); this.props.history.push("/login")}}>
                            <ExitToAppIcon className={classes.SettingsIcon} />
                        </Button>
                    </div>
                </Toolbar>
            </div>
        );
    }
}
export default withStyles(style)(withRouter(Header));
