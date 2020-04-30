import React from 'react'
import Header from './Header';
import { withRouter } from 'react-router-dom';
import QueryString from 'query-string'

import { getRequest, postRequest } from './Request';

import CloseIcon from '@material-ui/icons/Close';

class CrewDetailView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      crewInfo : undefined,
      id : '',
      name : ''
    }
    
    this.exit = this.exit.bind(this)
  }
  
  exit(data){
    this.props.history.push('/')
    
  }
  
  async componentWillMount() {
  
  const crew = QueryString.parse(this.props.location.search)
  let url = `https://api.themoviedb.org/3/find/${crew.id}?api_key=0bd4af129149c95eb2534f872838d4a9&language=en-US&external_source=imdb_id`
  this.setState ({id : crew.id, name : crew.name})
  
  await getRequest(url)
 .then((data) => data.json())
 .then((data) => {
     if(data.error)
     {
         console.log("Error in getting search data");
     }
     else 
     { 
       this.setState({crewInfo : data.person_results})
     }
 });
  
  }
  
  render(){
    let crewInfo = this.state.crewInfo;
    console.log("1",crewInfo)
    let details = crewInfo ? (crewInfo.length ? crewInfo[0] : 0) : undefined
    console.log("2", details)
    let imgURL = (details) ? "https://image.tmdb.org/t/p/original" + details.profile_path  :''
    console.log('3' ,imgURL)
    
      
    return (
      <>
        <Header />
        <div >
          <p> this is the crew Info page </p>
          <CloseIcon onClick = {this.exit }/>
          <h2 > <u>  {this.state.name} </u></h2>
          <div   >
            <div style = {{maxHeight: '200px' , maxWidth:'200px'}}>
              <img src = {imgURL}  alt ='Bag'/>
            </div>
          </div>
          
        </div>
    
      </>
    )
  }
  
}
  
  
  
  
  
  
  export default (withRouter(CrewDetailView));