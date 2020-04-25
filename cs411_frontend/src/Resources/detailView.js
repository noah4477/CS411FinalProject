import React from 'react'

class detailView extends React.Component{
  constructor(props){
    super(props);
    
    this.exit = this.exit.bind(this)
  }
  
   exit() {
    alert("exit")
    // this.props.history.push("/")
    console.log(this)
  }
  
  render(){
      let imgBaseURL = "https://image.tmdb.org/t/p/w200/"

      return (
        <div  >
              <div>
                <p onClick = {this.exit }>X </p>
                <h2> <u>Movie Title </u></h2>
                  <div  >
                    <div>
                      <img src = "" alt ='Bhag'/>
                    </div>
                    <div >
                      <div>
                        Release Date : 12/12/1998
                      </div>
                      <div>
                        Vote Avg : BhagBhposdil
                      </div>
                    </div>
                  </div>
                </div>
      </div>
    )
  }
  
  
}





export default detailView