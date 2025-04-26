import React, { useContext } from 'react';
import '../styles/GetStarted.css';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';


const GetStarted = () => {

    const { isLoggedin } = useContext(AppContext);
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (isLoggedin) {
            navigate('/quizzes');
        } else {
            navigate('/login');
        }
    };


    return (
        <div className='getStarted-main'>

            <div className="main-cont">
                <div className="getStarted-title">Start your coding journey with us!</div>
                <button onClick={handleGetStarted}>Get Started</button>
            </div>

        </div>
    )
}

export default GetStarted
