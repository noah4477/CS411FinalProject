import React from 'react'
import Header from './Header';
import { withRouter } from 'react-router-dom';
import QueryString from 'query-string'
import MovieList from './Helper/MovieList.js'
import { getRequest, postRequest } from './Request';
import CloseIcon from '@material-ui/icons/Close';
import Axios from 'axios'
import AltImg from './Helper/Movie_Not_Found.png'
import Cookies from 'js-cookie';
import {Star_Rating} from './Helper/Star_Rating.js'

const style2 = {
  marginTop: '34px',
   width: '100%',
   display:'flex',
   alignItems: 'center',
   justifyContent: 'center',
   flexDirection: 'column'
}

const style3 =  {
  marginTop: '34px',
  width: '80%',
  display:'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  margin : 'auto'
}


const style1 = {
  width: '80%',
  backgroundColor:  '#d0d7d9',
  padding: '15px',
  margin: 'auto',
  marginTop: '3vh'
}

class CrewDetailView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      crewInfo : undefined,
      id : '',
      name :'' ,
      titles : [],
      titleNames: [],
      profession : ''
    }
    
    this.exit = this.exit.bind(this)
    this.getMovies = this.getMovies.bind(this)
  }
  
  exit(data){
    this.props.history.push('/')
    
  }
  
  async componentWillMount() {
  
  const crew = await QueryString.parse(this.props.location.search)
  let url = `https://api.themoviedb.org/3/find/${crew.id}?api_key=0bd4af129149c95eb2534f872838d4a9&language=en-US&external_source=imdb_id`
  let name = crew.name, id = crew.id;
  this.setState({id : id , name: name})
  
  
   getRequest(url)
 .then((data) => data.json())
 .then((data) => {
     if(data.error)
     {
         console.log("Error in getting search data");
     }
     else {
       let name = data.person_results ? (data.person_results[0]) ? data.person_results[0].name : this.state.name : this.state.name
       this.setState({crewInfo : data.person_results})
       this.setState({name : name })
     }
 });
  
   postRequest('http://localhost:8000/api/getActorInfo', {actor: crew.id} )
   .then((data) => data.json())
   .then((data) => {
       if(data.error)
       {console.log("Error in Crew Info");}
       else 
       { 
         this.setState({ titles : (data.knownForTitles) ?  data.knownForTitles.split(',') : [] , profession : data.primaryProfession})
         this.getMovies(this.state.titles)
       }
   });
  }
  
  async getMovies(list){
    
    const promises= [];
    let movieNameList = []
    
    for (let i = 0; i< list.length; i ++){
        const promise =  Axios.post('http://localhost:8000/api/getMovieName', {movie: list[i]}, {headers: {
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + Cookies.get('jwt'),
        }})
        promises.push(promise)
    }
    
    Axios.all(promises)
      .then((response) =>{
        for (let i=0; i < list.length ; i++){
              let results = response[i].data.title;
              if (results === 'N/A'){
                list.splice(i, 1);
              }
              else
              movieNameList.push(results)
          }
          this.setState({titleNames : movieNameList, titles : list})
    })
    
    
    
  }
  
  render(){
    const crew =  QueryString.parse(this.props.location.search)
    let crewInfo = this.state.crewInfo;
    let details = crewInfo ? (crewInfo.length ? crewInfo[0] : 0) : undefined
    let imgURL = (details && details.profile_path) ? "https://image.tmdb.org/t/p/w200/" + details.profile_path  : AltImg
    return (
      <>
        <Header />
        <div style = {style1} >
          <CloseIcon onClick = {this.exit }/>
          <h2 style = {{textAlign : 'center'}}> <u>  {this.state.name} </u></h2>
          <div style = {style2} >
            <div>
              <img src = {imgURL}  alt ='Bag'/>
            </div>
            <br/>
            <div style ={{minWidth:'200px', alignItemsL :'center'}}>
              <Star_Rating id={crew.id} type = {'actor'}/>
            </div>
            <div style = {style3}>
              <div><br/>
                 Profession : {this.state.profession}
              </div>
              <div style= {{textAlign  :' center'}}><br/>
                Movies :  <MovieList list = {this.state.titleNames} IDlist = {this.state.titles} />
              
              </div><br/>
            </div>
          </div>
        </div>
    
      </>
    )
  }
  
}
  
  
  
  
  
  
  export default (withRouter(CrewDetailView));