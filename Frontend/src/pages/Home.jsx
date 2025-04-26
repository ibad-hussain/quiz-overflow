import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import LandingContainer from '../components/LandingContainer';
import Features from '../components/Features';
import TrendingQuizzes from '../components/TrendingQuizzes';
import HowItWorks from '../components/HowItWorks';
import GetStarted from '../components/GetStarted';


const Home = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);  // Simulate loading
    return () => clearTimeout(timer);
  }, []);


  if (loading) return <Loader />;


  return (
    <div className='home-main'>

      <LandingContainer />
      <Features />
      <TrendingQuizzes />
      <HowItWorks />
      <GetStarted />

    </div>
  )
}

export default Home
