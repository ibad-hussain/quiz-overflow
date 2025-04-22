import React from 'react';
import '../styles/NotFound.css';


const NotFound = ({text}) => {
    return (
        <div className="not-found-container-main">

            <span className="not-found-img"></span>
            <span className="not-found-text">{text}</span>

        </div>
    )
}

export default NotFound
