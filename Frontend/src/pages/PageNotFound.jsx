import React from 'react';
import '../styles/PageNotFound.css';
import { images } from "../utils/assets";


const PageNotFound = () => {
  return (
    <div className='pageNotFound-main'>
      <img src={images.pageNotFoundImage} alt="" />
      <h3>404 - Page Not Found</h3>
      <p>The page you're looking for doesn’t exist.</p>
    </div>
  )
}

export default PageNotFound
