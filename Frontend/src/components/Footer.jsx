import React from 'react';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <div className='footer-main'>

      <div className="footer-container">
        <div className="footer-left">
          <button><Link to='/contact'>Contact</Link></button>
          <p>|</p>
          <div className="about">
            <p>About</p>
            <p>developed by <a href="https://www.linkedin.com/in/ibadhussain/" target="_blank" rel="noopener noreferrer">Ibad Hussain</a></p>
          </div>
        </div>
        <div className="footer-right">© 2025 <span id='qo'>Quiz Overflow</span>. All Rights Reserved.</div>
      </div>

    </div>
  )
}

export default Footer
