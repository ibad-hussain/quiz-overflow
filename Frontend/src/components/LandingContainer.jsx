import React, { useContext } from 'react';
import '../styles/LandingContainer.css';
import { images } from '../utils/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';


const LandingContainer = () => {

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
        <div className='landingContainer-main'>

            <div className="left">
                <p className='left-title'>The Ultimate</p>
                <p className='left-title left-title-23'>Quiz Platform</p>
                <p className='left-title left-title-23'>For <span style={{ color: "#63afc2", textShadow: "1px 1px 1px #01ff5681" }}>Developers</span></p>
                <div className="container">
                    <div className="content">
                        <div className="content__container">
                            <ul className="content__container__list">
                                <li className="content__container__list__item">Challenge yourself and track your progress</li>
                                <li className="content__container__list__item">Test your knowledge, and earn badges</li>
                                <li className="content__container__list__item">Compete and level up your coding game</li>
                                <li className="content__container__list__item">Sharpen your skills, one quiz at a time</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <p className='left-subheading'>It's absolutely FREE</p>
                <button onClick={handleGetStarted}>Get Started</button>
            </div>

            <div className="right">
                <img src={images.landingPageMan} alt="Landing Page Avatar" />
            </div>

        </div>
    )
}

export default LandingContainer
