import React from 'react'
import { withRouter } from 'react-router-dom';

class PersonList extends React.Component{
  constructor (props){
    super (props);
  }
  
  
  render(){
    let space = '  ,  '
    let r = this.props.list.map((item,i) => {
        let crew = this.props.crewId[`${item}`]
        return   <a key={i} href='' onClick = { () => this.props.history.push('/crewDetailView?id=' +crew + "&name=" + item)}> {item} {space}</a>
    } )
    
    return (
        <>
          {r}
        </>
    )
    
  }
}

export default (withRouter(PersonList));
 