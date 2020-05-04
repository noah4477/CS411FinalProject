import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import AltImg from './Movie_Not_Found.png' 
import Axios from 'axios'
import { withRouter } from 'react-router-dom';

 
class Gallery extends React.Component {
  constructor (props){
    super (props)
    this.state = {
      IDs : this.props.Ids,
      galleryItems: Array(this.props.Ids.length).fill(AltImg).map((image,i) => <img key={i} src = {image} />)
  }

}
 
  responsive = {
    200: { items: 1 },
    560: { items: 3 },
    760: { items:  4},

    950: { items:  6},
  }
 
   componentWillMount(){
      let titles = this.props.Ids
      let posters = this.props.posters
      // console.log(titles)
      // console.log(posters)
  
      this.setState({galleryItems : titles.map((id,i) => 
        <div onClick = { () => this.props.history.push("/movieDetailView?title=null"+"&mID=" + id  )  }
        style = {{textAlign : 'center' , maxWidth : '160px' }}
    
        ><img style = {{width : '100%'}} key={i} src = {posters[i]} /></div>)
      })
    
    }
    
  
  render() {
    
    return (
      <div style ={{padding : "10px 0px 0px 0px", width : "70%" ,margin:'auto'}} >

      <AliceCarousel
        
        items={this.state.galleryItems}
        responsive={this.responsive}
        autoPlayInterval={400*this.props.speed}
        autoPlayDirection="rtl"
        autoPlay={true}
        fadeOutAnimation={true}
        mouseTrackingEnabled={true}
        buttonsDisabled={false}    
      />
      </div>
    )
  }
}

export default (withRouter(Gallery));
