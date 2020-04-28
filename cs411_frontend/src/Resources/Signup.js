import React from 'react';
import { withStyles,createMuiTheme  } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import lightBlue from '@material-ui/core/colors/lightBlue';
import grey from '@material-ui/core/colors/grey';
import {withRouter} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { postRequest } from './Request';
const Cookies = require('js-cookie')
var jwt = require('jsonwebtoken');

const theme = createMuiTheme({
    palette: {
      primary: grey,
      secondary: lightBlue,
    },
  });

const style = {
  root: {
    maxWidth: 400,
    maxHeight: 450,
    height: '100%',
    margin: 'auto',
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
  };


class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {username: "", password: "", firstName: "", lastName: ""};
        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(event) {
        event.preventDefault();

        postRequest("http://localhost:8000/api/signup", {username: this.state.username, password: this.state.password, lastName: this.state.lastName, firstName: this.state.firstName})
        .then((data) => data.json())
        .then((data) => {
            if(data.error)
            {
                console.log("Error in signing up");
            }
            else 
            {
              //Bad
              var token = jwt.decode(data.token)
              Cookies.set('jwt', data.token, { expires: new Date(token.exp * 1000) });
              this.props.history.push("/");
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (            
          <div style={{height: '100vh', position: 'relative'}}>
                <Card className={classes.root}>
      <CardContent>
        <form onSubmit={this.submitForm}>
            <Typography component="h2" variant="h5" style={{marginBottom: 20}}>
                Sign Up
            </Typography>
            <TextField
                id="standard-full-width"
                label="Username"
                required 
                placeholder="Enter username"
                margin="normal"
                value={this.state.username}
                onChange={(event) => this.setState({username: event.target.value})}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                id="standard-full-width"
                label="Password"
                required 
                placeholder="Enter password"
                type="password"
                margin="normal"
                value={this.state.password}
                fullWidth
                onChange={(event) => this.setState({password: event.target.value})}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                id="standard-full-width1"
                label="First Name"
                required 
                placeholder="Enter First Name"
                margin="normal"
                value={this.state.firstName}
                fullWidth
                onChange={(event) => this.setState({firstName: event.target.value})}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                id="standard-full-width2"
                label="Last Name"
                required 
                placeholder="Enter Last Name"
                margin="normal"
                value={this.state.lastName}
                fullWidth
                onChange={(event) => this.setState({lastName: event.target.value})}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Typography style={{textAlign: 'center', marginTop: 5}}>Have an account? <a href="http://localhost:3000/login">Log On</a></Typography>
            <Button type="submit" style={{backgroundColor: "Green", color: "white", minWidth: "30%", position: 'absolute', bottom: 15, right: '35%', left: '35%'}}>Submit</Button>
        </form>
      </CardContent>
    </Card>
    </div>    
        );
    }
}
export default withStyles(style)(withRouter(Signup));
