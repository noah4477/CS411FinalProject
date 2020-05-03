
import React from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import { getRequest } from './Request';

class RouterGaurd extends React.Component {
    constructor(props) {
      super(props);
      this.state = { isAuth: true };
    }
  
    componentWillMount() {
        if(['/login', '/signup'].includes(this.props.location.pathname) === false)
            {
                getRequest('http://localhost:8000/api/isLoggedIn')
                .then(resp => { if(resp.status === 401) {return {error: "Error: 401 Unauthorized"};} return resp.json();})
                .then((data) => {
                    if(data.error)
                    {
                        this.setState({isAuth: false});
                    }
                    else 
                    {
                        this.setState({isAuth: true});
                    }
                });
            }

        this.unlisten = this.props.history.listen((location, action) => {
            if(['/login', '/signup'].includes(this.props.location.pathname) === false)
            {
                getRequest('http://localhost:8000/api/isLoggedIn')
                .then(resp => { if(resp.status === 401) {return {error: "Error: 401 Unauthorized"};} return resp.json();})
                .then((data) => {
                    if(data.error)
                    {
                        this.setState({isAuth: false});
                    }
                    else 
                    {
                        this.setState({isAuth: true});
                    }
                });
            }
        });
    }
    componentWillUnmount() {
        this.unlisten();
    }
  
    render () {
      return (this.state.isAuth ? null : <Redirect to="/login" />);
    }
  }


  export default withRouter(RouterGaurd);