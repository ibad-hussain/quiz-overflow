import React from 'react';
import '../styles/Features.css';
import { images } from '../utils/assets';


const Features = () => {

  const featuresDetails = [
    {
      img: images.features1,
      title: "Wide Range Of Quizzes",
      desc: "Covering C++, JavaScript, Python, DSA, AI, and more. Whether you're a beginner or an expert, there's always something new to challenge yourself."
    },
    {
      img: images.features2,
      title: "Skills-Based Levels",
      desc: "Beginner, Intermediate, and Advanced quizzes for all skill levels. Start at your comfort level and gradually progress to more challenging questions."
    },
    {
      img: images.features3,
      title: "Instant Feedback",
      desc: "Get immediate results and explanations for correct answers. Learn from your mistakes and improve your understanding in real time."
    },
    {
      img: images.features4,
      title: "Track Your Progress",
      desc: "Earn points, see your stats, and improve your ranking. Keep an eye on your growth and stay motivated with detailed performance insights."
    },
    {
      img: images.features5,
      title: "Trophies And Badges",
      desc: "Compete with others and unlock badges. Achieve milestones, earn rewards, and showcase your expertise with exclusive trophies."
    },
    {
      img: images.features6,
      title: "Secure And Free",
      desc: "Completely free with no hidden costs. Your data is safe with us, and you can enjoy unlimited learning without any paywalls."
    },
  ];


  return (
    <div className='features-main'>

      <div className="features-title">Features</div>

      <div className="features-cards">
        {featuresDetails.map((feature, index) => (
          <div className="card" key={index}>
            <div className='img'>
              <img src={feature.img} alt={`feature ${index + 1}`} />
            </div>
            <p className='card-heading'>{feature.title}</p>
            <p className='card-subheading'>{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="features-cards-500">
        {featuresDetails.map((feature, index) => (
          <div className="card-500" key={index}>
            <div className='img-500'>
              <img src={feature.img} alt={`feature ${index + 1}`} />
            </div>
            <p className='card-heading-500'>{feature.title}</p>
            <p className='card-subheading-500'>{feature.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Features
