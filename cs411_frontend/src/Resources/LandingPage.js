import React from 'react';
import Header from './Header';

import Carousel from './Helper/Carousel.js'

function LandingPage() {
  
  let id = ['tt0078346','tt1434447','tt2377938','tt0059800','tt1280558','tt1408101','tt0120382','tt0338013','tt0057076','tt0311429',]
  return (
    <div>
      <Header />
      <Carousel Ids = {[...id]} speed = {5} />
      <Carousel Ids = {[...id]} speed = {5}/>
    </div>
  );
}

export default LandingPage;
