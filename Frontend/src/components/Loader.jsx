import React from 'react';
import '../styles/Loader.css';


const Loader = () => {
    return (
        <div className='qo-loading-container-main'>

            <div className="qo-loading-container">
                <div className="loader-container">
                    <div className="loader"></div>
                    <div className="loading-text">Loading...</div>
                </div>
            </div>

        </div>
    )
}

export default Loader
