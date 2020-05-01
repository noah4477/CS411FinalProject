import React from 'react'
import { withRouter } from 'react-router-dom';

class MovieList extends React.Component{
  constructor (props){
    super (props);
  }
  
  
  render(){
    let IDs = [] , list = this.props.list;
    IDs = this.props.IDlist.length  ? this.props.IDlist : new Array(list.length).fill(0);
    
    if (this.props.list.length > 4){
      IDs = IDs.slice(0, 4)
      list = list.slice(0, 4)
    }
    
    let r = list.map((item,i) => {
        return   <a key={i} href='' onClick = { () => this.props.history.push("/movieDetailView?title="+ item +"&mID=" + IDs[i]) }> {item} </a>
    } )
    
    return (
        <>
          {r}
        </>
    )
    
  }
}

export default (withRouter(MovieList));
 