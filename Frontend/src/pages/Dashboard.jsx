import React, { useEffect, useState, useContext } from 'react';
import '../styles/Dashboard.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { AppContext } from '../context/AppContext';
import axios from 'axios';


const Dashboard = () => {

  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalQuizzesTaken, setTotalQuizzesTaken] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(false);
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-data`);

        if (data.success) {
          const { userCount, quizzes, quizzesPerUser } = data.data;
          setTotalUsers(userCount);
          setTotalQuizzes(quizzes.length);
          setTotalQuizzesTaken(
            quizzesPerUser.reduce((total, user) => total + user.totalQuizzes, 0)
          );
        } else {
          setError(true);
        }

      } catch (error) {
        console.error('Error fetching dashboard data :', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendUrl]);


  if (loading) return <Loader />;
  if (error) return <NotFound text="Error fetching Admin Dashboard" />;


  return (
    <div className="dashboard-main">

      <div className="dashboard-title-1">QUIZ OVERFLOW</div>
      <div className="dashboard-title-2">The Ultimate Quiz Platform For Developers</div>

      <div className="dashboard-stats">
        <div className="dashboard-stats-cont">
          <div className="ds-number">{totalUsers}</div>
          <div className="ds-title">Registered Users</div>
        </div>
        <div className="dashboard-stats-cont">
          <div className="ds-number">{totalQuizzes}</div>
          <div className="ds-title">Quizzes Created</div>
        </div>
        <div className="dashboard-stats-cont">
          <div className="ds-number">{totalQuizzesTaken}</div>
          <div className="ds-title">Quizzes Taken</div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
