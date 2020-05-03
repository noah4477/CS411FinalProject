import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import AltImg from './Movie_Not_Found.png' 
import Axios from 'axios'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
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
    950: { items:  5},
  }
 
   componentWillMount(){
    
    const promises= [];
    let moviePosterList = [];
    
    for (let i = 0; i< this.props.Ids.length ; i ++){
        const promise =  Axios.get(`https://api.themoviedb.org/3/find/${this.state.IDs[i]}?api_key=0bd4af129149c95eb2534f872838d4a9&language=en-US&external_source=imdb_id`)
        promises.push(promise)
    }
    
    Axios.all(promises)
      .then((response) =>{
        for (let i=0; i < this.props.Ids.length ; i++){
              let movieInfo = response[i].data;
              let details = movieInfo ? (movieInfo.movie_results.length ? movieInfo.movie_results : (movieInfo.tv_results.length ? movieInfo.tv_results : 0 ) ) : 0; 
              let imgURL = (details && details[0].poster_path) ? "https://image.tmdb.org/t/p/w200/" + details[0].poster_path  : AltImg
              moviePosterList.push(imgURL)
          }
          
          this.setState({galleryItems : moviePosterList.map((image,i) => 
            <div onClick = { () => this.props.history.push("/movieDetailView?title=null"+"&mID=" + this.state.IDs[i]  )  }
            style = {{textAlign : 'center'}}><img key={i} src = {image} /></div>)
          })
    })
    // 
    
  }
 

  render() {
    return (
      <div style ={{padding : "70px 0px 10px 0px", width : "80%" ,margin:'auto'}} >
      <AliceCarousel
        
        items={this.state.galleryItems}
        responsive={this.responsive}
        autoPlayInterval={500*this.props.speed}
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