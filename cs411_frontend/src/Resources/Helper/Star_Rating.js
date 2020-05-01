import {FaStar} from 'react-icons/fa'
import React from 'react'


class Star_Rating extends React.Component {
  
  constructor(props){
    super (props)
    this.state = {
      ratingValue : null,
      hoverRating : null
    }
    this.setRequest = this.setRequest.bind(this)
  }
  
  async setRequest ({target}){
    await this.setState({ratingValue: target.value})
    alert(`Send Request: \n ID : ${this.props.id} , Rating : ${this.state.ratingValue} ` )
    
    // Make Request to Server Here !!!
    
  }
  
  
  // onClick( (e) => {this.getRequest(e) } )
  render (){
    return(
      <div style={{margin:'auto', width:'80%', textAlign:'center'}}>
      {Array(5).fill(1).map( (star, index) => {
        let curr_rating = index + 1;
        return (
        <label key = {index}>
          <input style = {{display : 'none'}}
          type='radio' 
          value = {curr_rating} 
          onClick = {this.setRequest}
          
          />
          <FaStar 
          color = { index < (this.state.hoverRating || this.state.ratingValue)  ? '#ffc107' : '#e4e5e9'}
          size= {20}
          onMouseEnter = { ( ) => { this.setState({hoverRating:curr_rating})  }}
          onMouseLeave = { ( ) => { this.setState({hoverRating: null})  }}/>
        </label>
      )})}
      </div>
    )
  }
  
}



export {Star_Rating}