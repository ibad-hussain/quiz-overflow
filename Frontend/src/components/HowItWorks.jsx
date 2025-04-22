import React from 'react';
import '../styles/HowItWorks.css';


const HowItWorks = () => {
    
    const cardDetails = [
        {
            title: "Sign Up",
            desc: "Create an account to save progress."
        },
        {
            title: "Choose a Quiz",
            desc: "Select your favorite programming language or topic."
        },
        {
            title: "Take the Quiz",
            desc: "Answer MCQs and get instant feedback."
        },
        {
            title: "Track & Improve",
            desc: "See your performance and retake quizzes."
        }
    ];


    return (
        <div className='howItWorks-main'>

            <div className="howItWorks-title">How It Works</div>

            <div className="howItWorks-cards">
                {cardDetails.map((card, idx) => (
                    <div key={idx} className="howItWorks-card">
                        <div class="align">
                            <span class="red"></span>
                            <span class="yellow"></span>
                            <span class="green"></span>
                        </div>
                        <p className='howItWorks-card-heading'>{card.title}</p>
                        <p className='howItWorks-card-subheading'>{card.desc}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default HowItWorks
